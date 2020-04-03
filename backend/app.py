from flask import Flask, escape, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import configparser

app = Flask(__name__)
app.config["DEBUG"] = True

# reading database credentials
config = configparser.ConfigParser()
config.read("credentials.ini")

# app configurations for database
db_username = config["database"]["db_username"]
db_password = config["database"]["db_password"]
db_hostname = config["database"]["db_hostname"]
db_port = config["database"]["db_port"]
db_database = config["database"]["db_database"]
db_protocol = "mysql+pymysql"
db_charset = "utf8mb4"
db_uri = "%s://%s:%s@%s:%s/%s?charset=%s" % (
    db_protocol,
    db_username,
    db_password,
    db_hostname,
    db_port,
    db_database,
    db_charset,
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = db_uri

db = SQLAlchemy(app)


# product table in database
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    plu = db.Column(db.BigInteger)
    name = db.Column(db.String(50))
    buying_price = db.Column(db.Float, nullable=True)
    selling_price = db.Column(db.Float, nullable=True)
    discount = db.Column(db.Float, nullable=True)
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
    total_amount = db.Column(db.Float, nullable=True)
    card_serial = db.Column(db.Integer, nullable=True)
    change = db.Column(db.Float, nullable=True)
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


@app.route("/sales", methods=["GET"])
def sales():
    plu = request.args.get("plu", None)
    name = request.args.get("name", None)
    dt1 = request.args.get("dt1", None)
    dt2 = request.args.get("dt2", None)
    if plu is not None:
        products = (
            db.session.query(Product)
            .join(Transaction)
            .filter(
                (Product.plu == plu)
                & (Transaction.date_time >= dt1)
                & (Transaction.date_time <= dt2)
            )
        )
    elif name is not None:
        products = (
            db.session.query(Product)
            .join(Transaction)
            .filter(
                (Product.name == name)
                & (Transaction.date_time >= dt1)
                & (Transaction.date_time <= dt2)
            )
        )
    else:
        products = (
            db.session.query(Product)
            .join(Transaction)
            .filter((Transaction.date_time >= dt1) & (Transaction.date_time <= dt2))
        )
    return jsonify({"products": [product.serialized for product in products]})


@app.route("/product", methods=["GET"])
def product():
    if request.method == "GET":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        if plu is not None:
            products = Product.query.filter(Product.plu == plu)
        elif name is not None:
            products = Product.query.filter(Product.name == name)
        return jsonify({"products": [product.serialized for product in products]})


@app.route("/inventory", methods=["GET"])
def inventory():
    if request.method == "GET":
        products = Product.query.filter(Product.transaction_id == None).order_by(
            Product.name
        )
        return jsonify({"products": [product.serialized for product in products]})


@app.route("/product/buyprice", methods=["PUT"])
def product_buyprice():
    if request.method == "PUT":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        price = request.args.get("price", None)
        if plu is not None:
            Product.query.filter(Product.plu == plu).update(
                {Product.buying_price: price}
            )
        elif name is not None:
            Product.query.filter(Product.name == name).update(
                {Product.buying_price: price}
            )
        db.session.commit()
        return "<h1>Updated buyprice</h1>"


@app.route("/product/sellprice", methods=["PUT"])
def product_sellprice():
    if request.method == "PUT":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        price = request.args.get("price", None)
        if plu is not None:
            Product.query.filter(Product.plu == plu).update(
                {Product.selling_price: price}
            )
        elif name is not None:
            Product.query.filter(Product.name == name).update(
                {Product.selling_price: price}
            )
        db.session.commit()
        return "<h1>Updated sellprice</h1>"
