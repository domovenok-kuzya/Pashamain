from fastapi import APIRouter
from typing import List
from .models import Goal, GoalCreate
from fastapi import HTTPException

from .models import Goal, Step, Resource, Achievement

router = APIRouter()

# Пока будем хранить всё в памяти
goals: List[Goal] = []
resources: List[Resource] = []
achievements: List[Achievement] = []

@router.get("/goals", response_model=List[Goal])
def get_goals():
    return goals

@router.post("/goals", response_model=Goal)
def create_goal(goal: GoalCreate):
    new_id = len(goals) + 1
    new_goal = Goal(id=new_id, title=goal.title, steps=goal.steps)
    goals.append(new_goal)
    return new_goal

@router.get("/resources", response_model=List[Resource])
def get_resources():
    return resources

@router.post("/resources", response_model=Resource)
def create_resource(resource: Resource):
    resources.append(resource)
    return resource

@router.get("/achievements", response_model=List[Achievement])
def get_achievements():
    return achievements

@router.patch("/goals/{goal_id}/steps", response_model=Goal)
def add_step(goal_id: int, step: Step):
    for goal in goals:
        if goal.id == goal_id:
            goal.steps.append(step)
            return goal
    raise HTTPException(status_code=404, detail="Goal not found")
@router.get("/goals/{goal_id}", response_model=Goal)
def get_goal(goal_id: int):
    for goal in goals:
        if goal.id == goal_id:
            return goal
    raise HTTPException(status_code=404, detail="Goal not found")