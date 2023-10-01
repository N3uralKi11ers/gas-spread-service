from fastapi import APIRouter, Request, Response, status, UploadFile, File, Depends
from schemas import *
from cv.process_photo import process_photo_in_evacuation_map

from copy import deepcopy

router = APIRouter(prefix="/api/v1")

@router.post("/process_time_series", response_model=EvacuationMapTimeSeries)
async def start_solve(data: BaseSettings):
    ev_map = data.evacuation_map
    for gas in data.gases:
        ev_map.ev_map[gas.pos.y][gas.pos.x] = BaseElement(BaseElement.gas)
    ev_map.ev_map[data.person.pos.y][data.person.pos.x] = BaseElement(BaseElement.person)
    ev_map.pprint()

    # TODO: тут будет отправка на аналитику
    
    ev_maps = []
    for _ in range(2):
        ev_maps.append(deepcopy(ev_map))
    res = EvacuationMapTimeSeries(maps_series=ev_maps)
    return res

@router.post("/process_evacuation_map")
async def post_photo(file: UploadFile = File(...)):
    content = await file.read()
    ev_map = process_photo_in_evacuation_map(content)
    ev_map.pprint()
    return ev_map

