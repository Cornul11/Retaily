from flask import Flask, escape, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import configparser

app = Flask(__name__)
app.config['DEBUG'] = True

config = configparser.ConfigParser()
config.read('credentials.ini')

db_username = config['database']['db_username']
db_password = config['database']['db_password']
db_hostname = config['database']['db_hostname']
db_port = config['database']['db_port']
db_database = config['database']['db_database']

# app configurations for database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config[
    'SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://' + db_username + ':' + db_password + '@' + db_hostname + ':' + db_port + '/' + db_database + '?charset=utf8mb4'

db = SQLAlchemy(app)


# product table in database
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    plu = db.Column(db.Integer)
    name = db.Column(db.String(50))
    buying_price = db.Column(db.Integer, nullable=True)
    selling_price = db.Column(db.Integer, nullable=True)
    discount = db.Column(db.Integer, nullable=True)
    transaction_id = db.Column(
        db.Integer, db.ForeignKey("transaction.id"), nullable=True
    )

    @property
    def serialized(self):
        return {
            "id": self.id,
            "plu": self.plu,
            "name": self.name,
            "buying_price": self.buying_price,
            "selling_price": self.selling_price,
            "discount": self.discount,
            "transaction_id": self.transaction_id,
        }


# transaction table in database
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date_time = db.Column(db.DateTime, nullable=True)
    receipt_number = db.Column(db.Integer, nullable=True)
    total_amount = db.Column(db.Integer, nullable=True)
    card_serial = db.Column(db.Integer, nullable=True)
    change = db.Column(db.Integer, nullable=True)
    products = db.relationship("Product", backref="contains")

    @property
    def serialized(self):
        return {
            "id": self.id,
            "date_time": self.date_time,
            "receipt_number": self.receipt_number,
            "total_amount": self.total_amount,
            "card_serial": self.card_serial,
            "change": self.change,
        }


@app.route("/")
def hello():
    name = request.args.get("name", "World")
    return f"Hello, {escape(name)}!"


# routes for retrieving sales between certain datetimes (dt)
# http://127.0.0.1:5000/get/sales/plu=10/dt1=2020-03-31%2021:40:39/dt2=2020-03-31%2023:40:39
@app.route("/get/sales/plu=<plu>/dt1=<dt1>/dt2=<dt2>")
def getSalesByPlu(plu, dt1, dt2):
    products = (
        db.session.query(Product)
            .join(Transaction)
            .filter(
            (Product.plu == plu)
            & (Transaction.date_time >= dt1)
            & (Transaction.date_time <= dt2)
        )
    )
    return jsonify({"products": [product.serialized for product in products]})


# http://127.0.0.1:5000/get/sales/name=banana/dt1=2020-03-31%2021:40:39/dt2=2020-03-31%2023:40:39
@app.route("/get/sales/name=<name>/dt1=<dt1>/dt2=<dt2>")
def getSalesByName(name, dt1, dt2):
    products = (
        db.session.query(Product)
            .join(Transaction)
            .filter(
            (Product.name == name)
            & (Transaction.date_time >= dt1)
            & (Transaction.date_time <= dt2)
        )
    )
    return jsonify({"products": [product.serialized for product in products]})


# http://127.0.0.1:5000/get/sales/dt1=2020-03-31%2021:40:39/dt2=2020-03-31%2023:40:39
@app.route("/get/sales/dt1=<dt1>/dt2=<dt2>")
def getAllSales(dt1, dt2):
    products = (
        db.session.query(Product)
            .join(Transaction)
            .filter((Transaction.date_time >= dt1) & (Transaction.date_time <= dt2))
    )
    return jsonify({"products": [product.serialized for product in products]})


# items that are not sold have no transaction_id
# http://127.0.0.1:5000/get/inventory
@app.route("/get/inventory")
def getInventory():
    products = Product.query.filter(Product.transaction_id == None)
    return jsonify({"products": [product.serialized for product in products]})


# http://127.0.0.1:5000/get/product/plu=10
@app.route("/get/product/plu=<plu>")
def getProductByPlu(plu):
    products = Product.query.filter(Product.plu == plu)
    return jsonify({"products": [product.serialized for product in products]})


# http://127.0.0.1:5000/get/product/name=banana
@app.route("/get/product/name=<name>")
def getProductByName(name):
    products = Product.query.filter(Product.name == name)
    return jsonify({"products": [product.serialized for product in products]})


# http://127.0.0.1:5000/update/product/buyprice/plu=10/price=69
@app.route("/update/product/buyprice/plu=<plu>/price=<price>")
def updateProductBuypricePlu(plu, price):
    Product.query.filter(Product.plu == plu).update({Product.buying_price: price})
    db.session.commit()
    return "<h1>Succes</h1>"


# http://127.0.0.1:5000/update/product/buyprice/name=banana/price=50
@app.route("/update/product/buyprice/name=<name>/price=<price>")
def updateProductBuypriceName(name, price):
    Product.query.filter(Product.name == name).update({Product.buying_price: price})
    db.session.commit()
    return "<h1>Succes</h1>"


# http://127.0.0.1:5000/update/product/sellprice/plu=10/price=69
@app.route("/update/product/sellprice/plu=<plu>/price=<price>")
def updateProductSellpricePlu(plu, price):
    Product.query.filter(Product.plu == plu).update({Product.selling_price: price})
    db.session.commit()
    return "<h1>Succes</h1>"


# http://127.0.0.1:5000/update/product/sellprice/name=banana/price=50
@app.route("/update/product/sellprice/name=<name>/price=<price>")
def updateProductSellpriceName(name, price):
    Product.query.filter(Product.name == name).update({Product.selling_price: price})
    db.session.commit()
    return "<h1>Succes</h1>"
