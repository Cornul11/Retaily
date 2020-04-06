from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Create Flask app
app = Flask(__name__)

# Configure the app from file: config.py
app.config.from_pyfile("config.py")

# Connect to the database
db = SQLAlchemy(app)

# Import the routes
from views import *

# Run app if executed
if __name__ == "__main__":
    app.run()
