from datetime import date, timedelta
from flask import Blueprint, request
import dateutil.parser as dt
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func

from src.constants.http_status_codes import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_401_UNAUTHORIZED,
    HTTP_404_NOT_FOUND,
)
from src.database import Food, User, db

foods = Blueprint("food", __name__, url_prefix="/api/v1/food")


@foods.route("/", methods=["GET", "POST"])
@jwt_required()
def handle_foods():
    current_user = get_jwt_identity()

    if request.method == "POST":
        name = request.get_json().get("name", "")
        food_date = request.get_json().get("food_date", "")
        calories = request.get_json().get("calories", "")

        food = Food(
            name=name,
            food_date=dt.parse(food_date),
            calories=calories,
            user_id=current_user,
        )
        db.session.add(food)
        db.session.commit()

        return {
            "id": food.id,
            "name": food.name,
            "food_date": food.food_date,
            "calories": food.calories,
            "created_at": food.created_at,
            "updated_at": food.updated_at,
        }, HTTP_201_CREATED

    else:
        foods = Food.query.filter_by(user_id=current_user)

        data = []

        for food in foods:
            data.append(
                {
                    "id": food.id,
                    "name": food.name,
                    "food_date": food.food_date,
                    "calories": food.calories,
                    "created_at": food.created_at,
                    "updated_at": food.updated_at,
                }
            )

        return {"data": data}, HTTP_200_OK


@foods.get("/<int:id>")
@jwt_required()
def get_food(id):
    current_user = get_jwt_identity()

    food = Food.query.filter_by(user_id=current_user, id=id).first()

    if not food:
        return {"error": "Item not found"}, HTTP_404_NOT_FOUND

    return {
        "id": food.id,
        "name": food.name,
        "food_date": food.food_date,
        "calories": food.calories,
        "created_at": food.created_at,
        "updated_at": food.updated_at,
    }, HTTP_200_OK


@foods.put("/<int:id>")
@foods.patch("/<int:id>")
@jwt_required()
def update_food(id):
    current_user = get_jwt_identity()

    name = request.get_json().get("name", "")
    food_date = request.get_json().get("food_date", "")
    calories = request.get_json().get("calories", "")

    food = Food.query.filter_by(user_id=current_user, id=id).first()

    if not food:
        return {"error": "Item not found"}, HTTP_404_NOT_FOUND

    food.name = name
    food.food_date = dt.parse(food_date)
    food.calories = calories

    db.session.commit()

    return {
        "id": food.id,
        "name": food.name,
        "food_date": food.food_date,
        "calories": food.calories,
        "created_at": food.created_at,
        "updated_at": food.updated_at,
    }, HTTP_200_OK


@foods.delete("/<int:id>")
@jwt_required()
def delete_food(id):
    current_user = get_jwt_identity()

    food = Food.query.filter_by(user_id=current_user, id=id).first()

    if not food:
        return {"error": "Item not found"}, HTTP_404_NOT_FOUND

    db.session.delete(food)
    db.session.commit()

    return {"message": "Successfully deleted food"}, HTTP_204_NO_CONTENT


@foods.get("/stats")
@jwt_required()
def admin_stats():
    current_user = get_jwt_identity()

    user = User.query.filter_by(id=current_user).first()

    if not user:
        return {"error": "User not found"}, HTTP_404_NOT_FOUND

    if not user.is_admin:
        return {"error": "User not authorized"}, HTTP_401_UNAUTHORIZED

    recent_week_entries = Food.query.filter(
        func.date(Food.food_date) >= date.today() - timedelta(weeks=1)
    ).all()

    past_week_entries = Food.query.filter(
        func.date(Food.food_date) < date.today() - timedelta(weeks=1)
        and func.date(Food.food_date) >= date.today() - timedelta(weeks=2)
    ).all()

    avg_cals_query = (
        db.session.query(Food.user_id, func.avg(Food.calories))
        .group_by(Food.user_id)
        .all()
    )

    avg_cals = []

    for user_id, avg_cal in avg_cals_query:
        u = User.query.filter_by(id=user_id).first()
        avg_cals.append(
            {
                "username": u.username,
                "email": u.email,
                "calorie_limit": u.calorie_limit,
                "avg_cal": avg_cal,
            }
        )

    return {
        "recent_week": len(recent_week_entries),
        "past_week": len(past_week_entries),
        "avg_cals": avg_cals,
    }
