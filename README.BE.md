# README

## Setting Up a Flask, Pydantic, SQLAlchemy, and SQLite Backend

In this guide, we will walk you through setting up a basic Flask application with Marshmallow, SQLAlchemy, and SQLite.
This backend setup will allow you to create a REST API.

# Beginner's Guide to Building a Flask API with SQLAlchemy, Pydantic and SQLite

This guide will help you build a simple API using Flask, SQLAlchemy, Pydantic and SQLite. You don't need any prior
knowledge of these technologies - we will start from the very basics!

## Terminology

Before we begin, let's understand what these technologies are:

1. **Flask**: Flask is a micro web framework written in Python. It's a tool that allows you to develop web applications
   easily. It has a small and easy-to-extend core. It's a microframework that doesn't include an ORM (Object Relational
   Manager) or such features.

2. **SQLAlchemy**: SQLAlchemy is a SQL toolkit and Object-Relational Mapping (ORM) system for the Python programming
   language. This means it allows you to interact with your database, like SQLite, in Python code instead of writing SQL
   queries.

3. **SQLite**: SQLite is a self-contained, file-based database system.

4. **Pydantic**: Pydantic is a Python library for data validation and settings management using Python type annotations.
   In other words, it allows you to validate the incoming data and give clear and concise error messages if the data is
   invalid.

## Project Structure

Here's the structure of the project we're going to build:

```markdown
.
├── flask-api/ # Main application directory
│ ├── app.py # For simplicity we will have only single file
```

**Note:** This guide assumes you have Python 3 installed on your system. If not, you can download it from the official
Python website: https://www.python.org/downloads/.

### Step 1: Setting Up the Environment

First, you need to set up a virtual environment. A virtual environment is a self-contained directory that contains a
Python installation for a particular version of Python, plus a number of additional packages.

Open your terminal (Command Prompt for Windows, Terminal.app for macOS) and navigate to the directory where you want to
create your project. Then, run the following commands:

```bash
# Create a new directory for your project
mkdir flask-api
cd flask-api

# Create a new virtual environment inside the directory
python3 -m venv env

# Activate the virtual environment
# On Windows:
env\Scripts\activate

# On macOS and Linux:
source env/bin/activate
```

Your terminal prompt should now start with `(env)`, indicating that you're inside the virtual environment.

### Step 2: Installing Dependencies

With the virtual environment activated, we can install Flask, Pydantic, SQLAlchemy, and SQLite.

#### Step 2.1: Creating the Requirements File

Create a new file in your project directory named `requirements.txt`. In this file, list the packages that your project
depends on:

```
Flask
Flask-SQLAlchemy
pydantic[flask]
flask-cors
```

Each line in `requirements.txt` is a package (and the version of it) that pip will install.

#### Step 2.2: Installing Dependencies with Pip

Now, you can install all your project's dependencies with one command. Make sure your virtual environment is activated,
then run:

```bash
pip install -r requirements.txt
```

Pip will install each of the listed packages.

From now on, whenever you add a new package to your project, add it to `requirements.txt`, then
run `pip install -r requirements.txt` to install it. This ensures that your project's dependencies are always in sync
with `requirements.txt`.

For example, if you decide to add the Python requests library to your project, add `requests` to `requirements.txt`,
then run `pip install -r requirements.txt`.

Using a `requirements.txt` file makes it easy to keep track of your project's dependencies and ensures that other
developers (or you, if you switch computers) can set up the project environment quickly.

Remember to commit `requirements.txt` in your Git repository. That way, everyone who works on the project can easily
install the correct dependencies.

#### Making sure IDE knows About The Venv

To make sure your Python interpreter knows about the packages installed in your virtual environment, you need to ensure
that you are using the Python executable inside your virtual environment.

When you activate a virtual environment (using `source env/bin/activate` on macOS/Linux or `.\env\Scripts\activate` on
Windows), your shell's PATH is temporarily modified to look for executables (like `python` and `pip`) inside the virtual
environment directory first. That's why, when you run `python` or `pip` after activating the virtual environment, it
uses the Python interpreter and package set inside the virtual environment, rather than the system-wide Python
interpreter.

In other words, as long as you've activated your virtual environment, when you run `python`, you are running the Python
interpreter inside your virtual environment, which knows about the packages you installed with `pip install`.

If you are using an Integrated Development Environment (IDE) like PyCharm or VS Code, you need to set the Python
interpreter for your project to the Python executable in your virtual environment:

- **PyCharm:** Go to "File" > "Settings" (or "PyCharm" > "Preferences" on macOS), then "Project: your_project_name" > "
  Python Interpreter". Click the gear icon, then "Add". Select "Existing environment", then use the "..." button to find
  and select the `python` executable in your virtual environment (`env/bin/python` or `env/Scripts/python.exe`).

- **VS Code:** First, open the command palette (Ctrl+Shift+P or Command+Shift+P), then search for "Python: Select
  Interpreter". In the dropdown that appears, select the interpreter that corresponds to your virtual environment. If
  it's not listed, you can enter the path to the `python` executable in your virtual environment manually.

In any case, remember to activate your virtual environment every time you start a new terminal session and before
running your Flask application. This ensures that you are using the correct Python interpreter and package set.

### Creating the Flask Application

#### Step 2: Setting Up Flask

Flask is a Python microframework for building web applications. A single instance of Flask is created as follows:

```python
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

vals = []
class TmpModelRequest(BaseModel):
    name: str

    class Config:
        extra = 'forbid'


@app.route('/tmp', methods=['GET'])
def get_tmp():
    return vals


@app.route('/tmp', methods=['POST'])
def update_tmp():
    user = TmpModelRequest(**request.get_json())
    vals.append(user.name)
    return vals

if __name__ == "__main__":
    app.run(debug=True)
```


#### Step 3: Configuring SQLAlchemy

SQLAlchemy is a SQL toolkit and ORM that offers high-level API for communicating with relational databases. This is how
we configure it:

```python
from flask_sqlalchemy import SQLAlchemy

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
```

We're using SQLite for simplicity's sake. `SQLALCHEMY_TRACK_MODIFICATIONS` is set to False to disable the modification
tracking system.

#### Step 4: Defining the User Data Model

The `User` class represents the 'users' table in our database:

```python
class User(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
```

Each 'User' has an id, a name, and an email.

#### Step 5: Request and Response Models with Pydantic

Pydantic is a data validation library. We define our request and response models with Pydantic as follows:

```python
from pydantic import BaseModel


class UserModelRequest(BaseModel):
    name: str
    email: str

    class Config:
        extra = 'forbid'
        orm_mode = True


class UserModelResponse(UserModelRequest):
    id: int
```

The `UserModelRequest` validates incoming request data when a new user is created. `UserModelResponse` represents the
data to be returned in the response.

#### Step 6: Defining HTTP Endpoints

HTTP endpoints allow interaction with our 'User' data. Let's explain each of these routes:

##### GET `/users`

This endpoint returns all users in our database:

```python
@app.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify([UserModelResponse.from_orm(user).dict() for user in users])
```

##### GET `/users/<int:id>`

This endpoint returns a user by its id. The `<int:id>` part of the route is a path parameter that Flask interprets as an
integer and passes to our function:

```python
@app.route('/users/<int:id>', methods=['GET'])
def get_user(id: int):
    user = User.query.get(id)
    if user is None:
        return {'error': 'not found'}, 404
    else:
        return UserModelResponse.from_orm(user).dict()
```

##### POST `/users`

This endpoint creates a new user. It uses Pydantic to validate the request data:

```python
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
```

Here, the `UserModelRequest` is instantiated with the JSON body of the request, which can raise a `ValidationError` if
the data is not what we expect. If the data is valid, the user is created, and the new user data is returned with a 201
status code (indicating successful creation). If the `IntegrityError` is raised (usually indicating a violation of a
database constraint, like a duplicate email), we return a 422 error response.

##### PUT `/users/<int:id>`

This endpoint updates an existing user. The `<int:id>` in the route is a path parameter that represents the id of the
user to update:

```python
@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id: int):
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
        return UserModelResponse.from_orm(existing_user).dict(), 200
    except ValidationError as e:
        return jsonify(e.errors()), 400
    except IntegrityError as e:
        return {"error": str(e.orig)}, 422
```

This endpoint functions similarly to the POST endpoint. It uses Pydantic to validate the request body and updates the
user if valid data is provided. If the user doesn't exist, a 404 error is returned.

#### Step 7: Running the Application

Lastly, we need to create the database tables and start the Flask app:

```python
if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
```

The `db.create_all()` function creates all necessary tables according to our models. The `app.run(debug=True)` command
starts the server in debug mode, providing detailed error messages when something goes wrong.

Congratulations! You've just built a Flask API with SQLAlchemy and Pydantic. This is a simple but powerful setup that
can serve as the basis for many types of web applications.

Your Flask application is now running! You can access it at `http://localhost:5000`.

To test your new endpoints, you can use a tool like curl, Postman, or any web browser. To retrieve all users, send
a `GET` request to `http://localhost:5000/users`. To create a new user, send a `POST` request
to `http://localhost:5000/user` with a JSON body like `{"name": "Alice", "email": "alice@example.com"}`.


Final flask app code:
```python
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

```
Happy coding!