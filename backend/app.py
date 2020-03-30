from flask import Flask, escape, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['DEBUG'] = True

# app configurations for database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@localhost/dbname?charset=utf8mb4'

db = SQLAlchemy(app)


# example table for the database
class Product(db.Model):
    plu = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    buying_price = db.Column(db.Integer)
    selling_price = db.Column(db.Integer)
    discount = db.Column(db.Integer)
    transaction_id = db.Column(db.Integer)


@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'
