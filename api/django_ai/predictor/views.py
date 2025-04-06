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

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load model and labels once
model = None
idx_to_class = None

def load_model():
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
        resnet.to(device)
        resnet.eval()
        model = resnet

transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

@api_view(['POST'])
def predict_image(request):
    load_model()

    image_file = request.FILES.get('file')
    if not image_file:
        return Response({'error': 'No file uploaded.'}, status=400)

    image = Image.open(image_file).convert('RGB')
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(image)
        _, predicted_class = torch.max(output, 1)
        predicted_label = idx_to_class[predicted_class.item()]

    return Response({'prediction': predicted_label})

