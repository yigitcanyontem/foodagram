from rest_framework.decorators import api_view
from rest_framework.response import Response
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
import torchvision
from PIL import Image
import io
import json
import os
import uuid
import re
import logging
from transformers import pipeline
from urllib.request import urlretrieve
from bs4 import BeautifulSoup
import requests
from django.conf import settings
import cv2
import numpy as np
from collections import Counter

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger = logging.getLogger(__name__)

CONFIDENCE_THRESHOLD = 77
NO_MATCH = "no match"
MIN_SIMILAR_IMAGES = 3



class LabelModel:
    _model = None
    _idx_to_class = None

    @classmethod
    def load(cls):
        if cls._model is None:
            base_path = os.path.join(os.path.dirname(__file__), 'model')
            model_path = os.path.join(base_path, 'resnet50_food101_2.pth')
            class_idx_path = os.path.join(base_path, 'class_to_idx.json')

            with open(class_idx_path, 'r') as f:
                class_to_idx = json.load(f)
                cls._idx_to_class = {v: k for k, v in class_to_idx.items()}

            resnet = torchvision.models.resnet50()
            resnet.fc = nn.Sequential(
                nn.Dropout(0.3),
                nn.Linear(resnet.fc.in_features, len(cls._idx_to_class))
            )
            resnet.load_state_dict(torch.load(model_path, map_location=device))
            resnet.to(device).eval()
            cls._model = resnet

        return cls._model, cls._idx_to_class


classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
resnet_sim = torchvision.models.resnet50(pretrained=True)
resnet_sim = nn.Sequential(*(list(resnet_sim.children())[:-1])).eval().to(device)

transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])



def safe_delete(path):
    if os.path.exists(path):
        try:
            os.remove(path)
        except Exception as e:
            logger.warning(f"Failed to delete {path}: {e}")


def extract_features(image):
    img_t = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        features = resnet_sim(img_t)
    return features.squeeze()


def is_food_name(name):
    labels = ["food", "not food"]
    hypothesis = f"This is a picture of {name}."
    result = classifier(hypothesis, labels)
    return result['labels'][0] == "food" and result['scores'][0] > 0.85

def download_images(food_name, num_images=8):
    search_url = f"https://www.google.com/search?tbm=isch&q={food_name}"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(search_url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    return [img["src"] for img in soup.find_all("img")[1:num_images+1] if "src" in img.attrs]

def similarity_check(upload_image, food_name):
    img_urls = download_images(food_name)
    upload_feature = extract_features(upload_image)
    match_count = 0

    for url in img_urls:
        try:
            filename, _ = urlretrieve(url)
            ref_img = Image.open(filename).convert("RGB")
            ref_feature = extract_features(ref_img)
            sim = F.cosine_similarity(upload_feature, ref_feature, dim=0).item()
            if sim > settings.SIMILARITY_THRESHOLD:
               match_count += 1
            safe_delete(filename)
        except Exception as e:
            logger.warning(f"Failed to compare image: {e}")
            continue

    return match_count >= MIN_SIMILAR_IMAGES

def is_blurry(pil_image):
    gray = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2GRAY)
    return cv2.Laplacian(gray, cv2.CV_64F).var() < 30

def enhance_image(pil_image):
    image = np.array(pil_image)
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    image = cv2.detailEnhance(image, sigma_s=10, sigma_r=0.15)
    return Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

def extract_frames(video_path, frame_rate=30):
    try:
        cap = cv2.VideoCapture(video_path)
        frames = []
        frame_count = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            if frame_count % frame_rate == 0:
                pil_frame = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                if not is_blurry(pil_frame):
                    frames.append(pil_frame)

            frame_count += 1

        if not frames:
            print("No non-blurry frames — fallback to grabbing 5 raw frames.")
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            fallback_frames = []
            fallback_frame_count = 0
            while cap.isOpened() and fallback_frame_count < 5:
                ret, frame = cap.read()
                if not ret:
                    break
                fallback_frame = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                fallback_frames.append(fallback_frame)
                fallback_frame_count += 1

            cap.release()
            return fallback_frames

        cap.release()
        return frames

    except Exception as e:
        logger.error(f"Error during frame extraction: {e}")
        return []





@api_view(['POST'])
def predict_image(request):
    model, idx_to_class = LabelModel.load()
    image_file = request.FILES.get('file')

    if not image_file or not image_file.content_type.startswith("image/"):
        return Response({'error': 'File must be an image.'}, status=400)

    try:
        image = Image.open(image_file).convert('RGB')
    except Exception:
        return Response({'error': 'Invalid image.'}, status=400)


    image_id = f"{uuid.uuid4()}.jpg"
    upload_path = os.path.join(settings.MEDIA_ROOT, 'uploads', image_id)
    os.makedirs(os.path.dirname(upload_path), exist_ok=True)
    image.save(upload_path)


    img_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(img_tensor)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        confidence, predicted_class = torch.max(probabilities, 0)

    confidence_percent = confidence.item() * 100

    if confidence_percent < settings.CLASSIFICATION_CONFIDENCE:
        return Response({
            'prediction': NO_MATCH,
            'confidence': f"{confidence_percent:.2f}%",
            'image_id': image_id
        })

    predicted_label = idx_to_class[predicted_class.item()]
    safe_delete(upload_path)

    return Response({
        'prediction': predicted_label,
        'confidence': f"{confidence_percent:.2f}%"
    })


@api_view(['POST'])
def verify_food_name(request):
    image_id = request.data.get('image_id')
    food_name = request.data.get('food_name')

    if not image_id or not food_name:
        return Response({'error': 'image_id and food_name are required.'}, status=400)

    if len(food_name) > settings.MAX_FOOD_NAME_LENGTH:
        return Response({'error': 'Food name too long.'}, status=400)

    #if not re.match(r'^[\w\s\-]+$', food_name, re.UNICODE):
        #return Response({'error': 'Invalid food name format.'}, status=400)

    image_path = os.path.join(settings.MEDIA_ROOT, 'uploads', image_id)
    if not os.path.exists(image_path):
        return Response({'error': 'Uploaded image not found.'}, status=404)



    try:
        image = Image.open(image_path).convert('RGB')

        if not is_food_name(food_name):
            return Response({'prediction': NO_MATCH, 'reason': 'Not recognized as food.'})

        if not similarity_check(image, food_name):
            return Response({'prediction': NO_MATCH, 'reason': 'Low visual similarity.'})

        return Response({'prediction': food_name, 'reason': 'Food verified successfully.'})

    except Exception as e:
        logger.error(f"Error in verify_food_name: {e}")
        return Response({'error': 'Failed to process uploaded image.'}, status=400)

    finally:
        safe_delete(image_path)

@api_view(['POST'])
def process_video(request):
    video_file = request.FILES.get('file')
    raw_food_name = request.data.get('food_name')
    food_name = raw_food_name.strip() if raw_food_name else None

    print("FILES:", request.FILES)
    print("DATA:", request.data)
    print("Video file:", video_file)
    print("Video file MIME type:", video_file.content_type)
    print(f"Raw food name: '{raw_food_name}'")
    print(f"Stripped food name: '{food_name}'")

    if not video_file:
        return Response({'error': 'No video file provided.'}, status=400)

    if not (video_file.content_type.startswith("video/") or video_file.content_type == "image/mp4"):
        return Response({'error': 'File must be a video.'}, status=400)

    video_id = f"{uuid.uuid4()}.mp4"
    video_path = os.path.join(settings.MEDIA_ROOT, 'videos', video_id)
    os.makedirs(os.path.dirname(video_path), exist_ok=True)
    with open(video_path, 'wb') as temp_video:
        for chunk in video_file.chunks():
            temp_video.write(chunk)

    frames = extract_frames(video_path, frame_rate=30)
    print(f"Total extracted frames (non-blurry): {len(frames)}")
    safe_delete(video_path)

    if not frames:
        return Response({'error': 'No frames could be extracted from the video.'}, status=400)

    model, idx_to_class = LabelModel.load()
    food_frame_count = 0
    total_frames = len(frames)
    predicted_classes = []
    for frame in frames:
        frame = enhance_image(frame)
        img_tensor = transform(frame).unsqueeze(0).to(device)
        with torch.no_grad():
            output = model(img_tensor)
            probabilities = torch.nn.functional.softmax(output[0], dim=0)
            confidence, predicted_class = torch.max(probabilities, 0)

        confidence_percent = confidence.item() * 100
        if confidence_percent >= settings.VIDEO_CLASSIFICATION_THRESHOLD:
            food_frame_count += 1
            predicted_classes.append(predicted_class.item())

    food_percentage = (food_frame_count / total_frames) * 100



    if food_percentage >= settings.VIDEO_APPROVAL_THRESHOLD:
        most_common_class = Counter(predicted_classes).most_common(1)
        predicted_label = idx_to_class[most_common_class[0][0]] if most_common_class else "unknown"

        return Response({
            'total_frames': total_frames,
            'food_frame_count': food_frame_count,
            'food_percentage': f"{food_percentage:.2f}%",
            'prediction': predicted_label,
            'approved': True
        })


    if not food_name or food_name.lower() == "none":
        return Response({
            'total_frames': total_frames,
            'food_frame_count': food_frame_count,
            'food_percentage': f"{food_percentage:.2f}%",
            'approved': False,
            'requires_manual_verification': True,
            'reason': 'Model rejected video. Food name required for manual verification.'
        }, status=200)


    if not is_food_name(food_name):
        return Response({
            'total_frames': total_frames,
            'approved': False,
            'prediction': NO_MATCH,
            'reason': 'Food name not recognized as food.'
        })


    sampled_frames = frames[:8]
    passed_sim = any(similarity_check(frame, food_name) for frame in sampled_frames)

    if passed_sim:
        return Response({
            'total_frames': total_frames,
            'food_frame_count': food_frame_count,
            'food_percentage': f"{food_percentage:.2f}%",
            'approved': True,
            'prediction': food_name,
            'reason': 'Approved via similarity check and food name verification.'
        })
    else:
        return Response({
            'total_frames': total_frames,
            'approved': False,
            'prediction': NO_MATCH,
            'reason': 'Similarity check failed.'
        })


