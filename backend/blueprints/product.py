from flask import Blueprint, request, jsonify
from models import Product, Transaction
from app import db

# Define the blueprint
product_bp = Blueprint("product", __name__)

# Define the routes
@product_bp.route("/", methods=["GET"])
def product():
    if request.method == "GET":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        if plu is not None:
            products = Product.query.filter(Product.plu == plu)
        elif name is not None:
            products = Product.query.filter(Product.name == name)
        return jsonify({"products": [product.serialized for product in products]})


@product_bp.route("/buyprice", methods=["PUT"])
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


@product_bp.route("/sellprice", methods=["PUT"])
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
