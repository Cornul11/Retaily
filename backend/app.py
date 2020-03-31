from flask import Flask, escape, request, jsonify
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['DEBUG'] = True

# app configurations for database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://tm69H1sxd0:xnSlasPerh@remotemysql.com:3306/tm69H1sxd0?charset=utf8mb4'

db = SQLAlchemy(app)


# product table in database
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    plu = db.Column(db.Integer)
    name = db.Column(db.String(50))
    buying_price = db.Column(db.Integer, nullable=True)
    selling_price = db.Column(db.Integer, nullable=True)
    discount = db.Column(db.Integer, nullable=True)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transaction.id'), nullable=True)

    @property
    def serialized(self):
        return {
            'plu': self.plu,
            'name': self.name,
            'buying_price': self.buying_price,
            'selling_price': self.selling_price,
            'discount': self.discount,
            'transaction_id': self.transaction_id,
        }



# transaction table in database
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date_time = db.Column(db.DateTime, nullable=True)
    receipt_number = db.Column(db.Integer, nullable=True)
    total_amount = db.Column(db.Integer, nullable=True)
    card_serial = db.Column(db.Integer, nullable=True)
    change = db.Column(db.Integer, nullable=True)
    products = db.relationship('Product', backref='contains')

    @property
    def serialized(self):
        return {
            'id': self.id,
            'date_time': self.date_time,
            'receipt_number': self.receipt_number,
            'total_amount': self.total_amount,
            'card_serial': self.card_serial,
            'change': self.change,
        }


@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'
