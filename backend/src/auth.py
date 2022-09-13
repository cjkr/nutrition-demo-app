from random import choices
import string
from flask import Blueprint, request
from werkzeug.security import check_password_hash, generate_password_hash
import validators
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from src.database import User, db
from src.constants.http_status_codes import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_409_CONFLICT,
)

auth = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


@auth.post("/register")
def register():
    username = request.get_json().get("username", "")
    email = request.get_json().get("email", "")
    password = request.get_json().get("password", "")

    if len(password) < 6:
        return {"error": "Password is too short"}, HTTP_400_BAD_REQUEST

    if len(username) < 3:
        return {"error": "Username is too short"}, HTTP_400_BAD_REQUEST

    if not username.isalnum() or " " in username:
        return {
            "error": "Username should be alphanumeric and should have no spaces"
        }, HTTP_400_BAD_REQUEST

    if not validators.email(email):
        return {"error": "Email is not valid"}, HTTP_400_BAD_REQUEST

    if User.query.filter_by(username=username).first() is not None:
        return {"error": "Username is taken"}, HTTP_409_CONFLICT

    if User.query.filter_by(email=email).first() is not None:
        return {"error": "Email is taken"}, HTTP_409_CONFLICT

    hashed_password = generate_password_hash(password)

    user = User(username=username, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return {
        "message": "User created",
        "user": {"username": username, "email": email},
    }, HTTP_201_CREATED


@auth.post("/login")
def login():
    email = request.get_json().get("email", "")
    password = request.get_json().get("password", "")

    user = User.query.filter_by(email=email).first()

    if user:
        is_pass_correct = check_password_hash(user.password, password)

        if is_pass_correct:
            access = create_access_token(identity=user.id)
            refresh = create_refresh_token(identity=user.id)

            return {
                "user": {
                    "access": access,
                    "refresh": refresh,
                    "username": user.username,
                    "email": user.email,
                    "id": user.id,
                    "calorie_limit": user.calorie_limit,
                    "is_admin": user.is_admin,
                }
            }, HTTP_200_OK

        return {"error": "Wrong credentials"}, HTTP_401_UNAUTHORIZED

    return {"error": "User does not exist"}, HTTP_401_UNAUTHORIZED


@auth.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()

    return {"username": user.username, "email": user.email}, HTTP_200_OK


@auth.post("/token/refresh")
@jwt_required(refresh=True)
def refresh_users_token():
    identity = get_jwt_identity()
    access = create_access_token(identity=identity)

    return {"access": access}, HTTP_200_OK


@auth.post("/invite_friend")
@jwt_required()
def invite_friend():
    username = request.get_json().get("username", "")
    email = request.get_json().get("email", "")

    if len(username) < 3:
        return {"error": "Username is too short"}, HTTP_400_BAD_REQUEST

    if not username.isalnum() or " " in username:
        return {
            "error": "Username should be alphanumeric and should have no spaces"
        }, HTTP_400_BAD_REQUEST

    if not validators.email(email):
        return {"error": "Email is not valid"}, HTTP_400_BAD_REQUEST

    if User.query.filter_by(username=username).first() is not None:
        return {"error": "Username is taken"}, HTTP_409_CONFLICT

    if User.query.filter_by(email=email).first() is not None:
        return {"error": "Email is taken"}, HTTP_409_CONFLICT

    password = "".join(
        [
            choices(string.ascii_letters + string.digits + string.punctuation)[
                0
            ]
            for i in range(10)
        ]
    )

    hashed_password = generate_password_hash(password)

    user = User(username=username, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return {
        "message": "User created",
        "user": {"username": username, "email": email, "password": password},
    }, HTTP_201_CREATED
