import cv2
import numpy as np
import os
from schemas import EvacuationMap, BaseElement

def convert_np_array_to_evacuation_map(np_array: np.ndarray) -> EvacuationMap:
    ev_map = []
    for row in np_array:
        ev_map_row = []
        for element in row:
            ev_map_row.append(BaseElement(element))
        ev_map.append(ev_map_row)
    return EvacuationMap(ev_map=ev_map)

def resize_image(image, size):
    height, width = image.shape[:2]
    max_side = max(height, width)
    scale = size / max_side
    resized_image = cv2.resize(image, (int(width * scale), int(height * scale)))
    square_image = np.zeros((size, size, 3), np.uint8)
    square_image[:, :] = (0, 0, 0)
    x_offset = (size - resized_image.shape[1]) // 2
    y_offset = (size - resized_image.shape[0]) // 2
    square_image[y_offset:y_offset+resized_image.shape[0], x_offset:x_offset+resized_image.shape[1]] = resized_image
    return square_image


def process_photo_in_evacuation_map(file: bytes) -> EvacuationMap:
    nparr = np.frombuffer(file, np.uint8)
    not_process_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    image = resize_image(not_process_image, 10)

    img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    min_values = np.min(img, axis=2)
    max_values = np.max(img, axis=2)

    channel_diff = max_values - min_values

    result_matrix = np.zeros_like(min_values, dtype=np.uint8)

    result_matrix[np.logical_or(max_values <= 25, (max_values <= 110) & (channel_diff < 20))] = 1
    
    return convert_np_array_to_evacuation_map(result_matrix)