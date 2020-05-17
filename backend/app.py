from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Create Flask app
app = Flask(__name__)
cors = CORS(app)

# Configure the app from file: config.py
app.config.from_pyfile("config.py")
app.config['CORS_HEADERS'] = 'Content-Type'

# Connect to the database
db = SQLAlchemy(app)

# Import the routes
from views import *

# Run app if executed
if __name__ == "__main__":
    app.run()
