from __future__ import annotations

import os
from typing import Optional, List

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from pydantic import BaseModel
from pydantic.class_validators import root_validator
from pydantic.error_wrappers import ValidationError
from sqlalchemy import Column, Integer, String
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Setup database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class UserModelRequest(BaseModel):
    name: str
    email: str

    class Config:
        extra = 'forbid'
        orm_mode = True


class UserModelUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    id: int

    @root_validator(pre=True)
    @classmethod
    def validate_body(cls, values):
        if 'name' not in values and 'email' not in values:
            raise ValueError('at least one value need to be provided: name, emai')

        return values


class UserModelResponse(UserModelRequest):
    id: int


class User(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    email = Column(String(50), unique=True, nullable=False)

    @classmethod
    def get_all_users(cls) -> List[User]:
        return User.query.all()

    @classmethod
    def get_by_id(cls, _id: int) -> User:
        return User.query.get(_id)

    @classmethod
    def create_user(cls, user: UserModelRequest) -> None:
        new_user = User(name=user.name, email=user.email)

        db.session.add(new_user)
        db.session.commit()


@app.route('/users', methods=['GET'])
def get_all_users():
    users = User.get_all_users()
    return [UserModelResponse.from_orm(user).dict() for user in users]


@app.route('/users/<int:id>', methods=['GET'])
def get_user(id: int):
    user = User.get_by_id(id)
    if user is None:
        return {'error': 'not found'}, 404
    else:
        return UserModelResponse.from_orm(user).dict()


@app.route('/users', methods=['POST'])
def save_user():
    try:
        user = UserModelRequest(**request.get_json())
        User.create_user(user)
        return user.dict(), 201
    except ValidationError as e:
        return jsonify(e.errors()), 400
    except IntegrityError as e:
        return {"error": str(e.orig)}, 422


@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    try:
        user = UserModelUpdate(**request.get_json(), id=id)
        existing_user = User.query.get(id)
        if existing_user is None:
            return {'error': 'not found'}, 404

        if user.name:
            existing_user.name = user.name
        if user.email:
            existing_user.email = user.email

        db.session.commit()
        return UserModelResponse.from_orm(existing_user).dict()

    except ValidationError as e:
        return jsonify(e.errors()), 400
    except IntegrityError as e:
        return {"error": str(e.orig)}, 422


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
