from pydantic import BaseModel
from typing import List, Optional

class Step(BaseModel):
    title: str
    completed: bool = False
    planned_for: Optional[str] = None  # дата в формате строки

class Goal(BaseModel):
    id: int
    title: str
    steps: List[Step] = []

class GoalCreate(BaseModel):
    title: str
    steps: List[Step] = []

class Resource(BaseModel):
    id: int
    title: str
    url: str
    description: Optional[str] = None

class Achievement(BaseModel):
    id: int
    title: str
    unlocked: bool = False