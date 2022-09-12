from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

foods = Blueprint("food", __name__, url_prefix="/api/v1/food")
