import json
from PIL import Image
from io import BytesIO
from pydantic import BaseModel, validator
from typing import List, Optional, Tuple
from enum import Enum
from fastapi import FastAPI, Form, UploadFile, File

class Pos(BaseModel):
    x: int
    y: int
    
    def to_tuple(self) -> Tuple[int, int]:
        return (self.x, self.y)
    
    def to_tuple_yx(self) -> Tuple[int, int]:
        return (self.y, self.x)
    

class GasType(Enum):
    test_gas = 0


class Gas(BaseModel):
    pos: Pos
    gas_type: GasType

    def velocity(self) -> float:
        pass

class Person(BaseModel):
    pos: Pos
    velocity: float = 1.0

class Destination(BaseModel):
    position: Pos
    
class Route(BaseModel):
    points: List[Pos]

class BaseElement(Enum):
    free = 0
    wall = 1
    person = 2
    gas = 3

class EvacuationMap(BaseModel):
    
    ev_map: List[List[BaseElement]]
    
    def pprint(self):
        for i in range(len(self.ev_map)):
            row = ""
            for j in range(len(self.ev_map[i])):
                row += f"{self.ev_map[i][j].value} "
            print(row)
    
    def to_array(self) -> List[List[int]]:
        return [[v.value for v in _map] for _map in self.ev_map]

class EvacuationMapTimeSeries(BaseModel):
    maps_series: List[EvacuationMap]

    def pprint(self):
        for t in range(len(self.maps_series)):
            print(t)
            self.maps_series[t].pprint()

class BaseSettings(BaseModel):
    person: Person = Form(...)
    gases: List[Gas] = Form(...)
    evacuation_map: EvacuationMap = Form(...)

    class Config:
        from_attributes = True
