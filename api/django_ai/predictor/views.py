from rest_framework.decorators import api_view
from rest_framework.response import Response
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision
from PIL import Image
import io
import json
import os
import torch.nn.functional as F
from transformers import pipeline
from urllib.request import urlretrieve
from bs4 import BeautifulSoup
import requests
import uuid
from django.conf import settings

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load label-based model and labels once
model, idx_to_class = None, None
def load_label_model():
    global model, idx_to_class
    if model is None:
        model_path = os.path.join(os.path.dirname(__file__), 'model', 'resnet50_food101_2.pth')
        class_idx_path = os.path.join(os.path.dirname(__file__), 'model', 'class_to_idx.json')

        with open(class_idx_path, 'r') as f:
            class_to_idx = json.load(f)
            idx_to_class = {v: k for k, v in class_to_idx.items()}

        resnet = torchvision.models.resnet50()
        resnet.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(resnet.fc.in_features, len(idx_to_class))
        )
        resnet.load_state_dict(torch.load(model_path, map_location=device))
        resnet.to(device).eval()
        model = resnet

# Food similarity model
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
resnet_sim = torchvision.models.resnet50(pretrained=True)
resnet_sim = torch.nn.Sequential(*(list(resnet_sim.children())[:-1])).eval().to(device)

# Image transform
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def is_food_name(name):
    labels = ["food", "not food"]
    hypothesis = f"This is a picture of {name}."
    result = classifier(hypothesis, labels)
    return result['labels'][0] == "food" and result['scores'][0] > 0.85

def download_images(food_name, num_images=5):
    search_url = f"https://www.google.com/search?tbm=isch&q={food_name}"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(search_url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    return [img["src"] for img in soup.find_all("img")[1:num_images+1] if "src" in img.attrs]

def extract_features(image):
    img_t = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        features = resnet_sim(img_t)
    return features.squeeze()

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
            if sim > 0.77:
                match_count += 1
            os.remove(filename)
        except Exception as e:
            continue

    return match_count >= 3

@api_view(['POST'])
def predict_image(request):
    load_label_model()
    image_file = request.FILES.get('file')
    if not image_file:
        return Response({'error': 'No file uploaded.'}, status=400)

    try:
        image = Image.open(image_file)
        image = image.convert('RGB')
    except Exception:
        return Response({'error': 'Invalid image.'}, status=400)

    # Save image temporarily
    image_id = f"{uuid.uuid4()}.jpg"
    upload_path = os.path.join(settings.MEDIA_ROOT, 'uploads', image_id)
    os.makedirs(os.path.dirname(upload_path), exist_ok=True)
    image.save(upload_path)

    # Predict
    img_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(img_tensor)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        confidence, predicted_class = torch.max(probabilities, 0)

    confidence_percent = confidence.item() * 100

    if confidence_percent < 60:
        return Response({
            'prediction': 'no match',
            'confidence': f"{confidence_percent:.2f}%",
            'image_id': image_id
        })
    else:
        predicted_label = idx_to_class[predicted_class.item()]

        os.remove(upload_path)

        return Response({
            'prediction': predicted_label,
            'confidence': f"{confidence_percent:.2f}%",
        })

@api_view(['POST'])
def verify_food_name(request):
    image_id = request.data.get('image_id')
    food_name = request.data.get('food_name')

    if not image_id or not food_name:
        return Response({'error': 'image_id and food_name are required.'}, status=400)

    image_path = os.path.join(settings.MEDIA_ROOT, 'uploads', image_id)
    if not os.path.exists(image_path):
        return Response({'error': 'Uploaded image not found.'}, status=404)

    try:
        image = Image.open(image_path).convert('RGB')

        if not is_food_name(food_name):
            return Response({'prediction': 'no match', 'reason': 'Not recognized as food.'})

        if not similarity_check(image, food_name):
            return Response({'prediction': 'no match', 'reason': 'Low visual similarity.'})

        return Response({'prediction': food_name, 'reason': 'Food verified successfully.'})

    except Exception:
        return Response({'error': 'Failed to open uploaded image.'}, status=400)

    finally:
        # 🔥 FINAL block always runs, even if errors happen
        if os.path.exists(image_path):
            os.remove(image_path)



