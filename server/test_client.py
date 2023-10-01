import requests
from PIL import Image
from io import BytesIO
import cv2
import numpy as np

def image_to_bytes(image):
    # Преобразуем изображение в массив байтов
    # _, buffer = cv2.imencode('.jpg', image)
    # Преобразуем массив байтов в байты

    bytes_image = image.tobytes()
    return bytes_image

url = "http://localhost:8000/api/v1/"

# Создаем объекты, которые будем отправлять на сервер
person = {"pos": {"x": 10, "y": 20}, "velocity": 1.0}
gas = {"pos": {"x": 30, "y": 40}, "gas_type": 0}
image = np.array(cv2.imread("test_image.jpg"))

# Преобразуем изображение в байты
image_bytes = image_to_bytes(image)
print(image.shape)
print(np.frombuffer(image_bytes, dtype=np.uint8).reshape(image.shape))

# Создаем JSON-объект, описывающий объект BaseSettings
base_settings = {"person": person, "gases": [gas], "image": str(image_bytes)}

# Отправляем POST-запрос на сервер
response = requests.post(url, json=base_settings)

# Выводим ответ сервера
print(response.content)
