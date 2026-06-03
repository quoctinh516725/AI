import cv2
from fastapi import HTTPException
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image
from scipy.spatial.distance import cosine
import matplotlib.pyplot as plt

# Kiểm tra nếu có GPU thì dùng, không thì dùng CPU
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Detect mặt từ ảnh sử dụng MTCNN
mtcnn = MTCNN(image_size=160, margin=10, keep_all=False, device=device)

# Lấy bộ dữ liệu VGGFace2 đã được huấn luyện sẵn cho model InceptionResnetV1
resnet = InceptionResnetV1(pretrained='vggface2').to(device).eval()

def extract_face(frame):
    if frame is None:
        raise HTTPException(status_code=400, detail="Không đọc được ảnh từ đường dẫn yêu cầu.")

    # InceptionResnetV1 yêu cầu định dạng màu là RGB, trong khi OpenCV đọc ảnh ở định dạng BGR
    img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Chuyển đổi sang PIL Image vì MTCNN hoạt động tốt với PIL
    img_pil = Image.fromarray(img_rgb)

    # Nếu phát hiện 2 mặt trở lên bao lỗi
    boxes, probs = mtcnn.detect(img_pil)

    if boxes is not None and probs is not None:
        # Lọc các box có độ tin cậy > 0.90
        valid_boxes = [box for box, p in zip(boxes, probs) if p is not None and p > 0.90]
        
        if len(valid_boxes) > 1:
            # Tính diện tích các khuôn mặt (x2 - x1) * (y2 - y1)
            areas = [(box[2] - box[0]) * (box[3] - box[1]) for box in valid_boxes]
            areas.sort(reverse=True)
            
            # Nếu khuôn mặt to nhất không lớn hơn hẳn (ví dụ 3 lần) khuôn mặt thứ 2, thì từ chối
            # (Tránh trường hợp ảnh chụp nhóm không biết ai là chính)
            if areas[0] < 3 * areas[1]:
                raise HTTPException(
                    status_code=400, 
                    detail="Phát hiện nhiều gương mặt có kích thước tương đương nhau. Vui lòng cung cấp ảnh chỉ có một gương mặt rõ ràng."
                )

    face_tensor = mtcnn(img_pil)

    if face_tensor is not None:
        return face_tensor.unsqueeze(0).to(device)  # Thêm batch dimension và chuyển sang device
    raise HTTPException(status_code=400, detail="Không phát hiện khuôn mặt trong ảnh.")
    
def get_embedding(face_tensor):
    with torch.no_grad():
        emb = resnet(face_tensor)
    return emb[0].cpu().numpy()  # trả về embedding dưới dạng numpy array
    