from flask import Blueprint, request, jsonify, abort
from models import Product, Transaction, Product_info
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
            product = Product_info.query.filter(Product_info.plu == plu).first()
        elif name is not None:
            product = Product_info.query.filter(Product_info.name == name).first()
        else:
            abort(400)
        return jsonify(product.serialized)


@product_bp.route("/buyprice/", methods=["PUT"])
def product_buyprice():
    if request.method == "PUT":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        price = request.args.get("price", None)
        if price is None:
            abort(400)
        elif plu is not None:
            Product_info.query.filter(Product_info.plu == plu).update(
                {Product_info.buying_price: price}
            )
            db.session.commit()
            product = Product_info.query.filter(Product_info.plu == plu).first()
        elif name is not None:
            Product_info.query.filter(Product_info.name == name).update(
                {Product_info.buying_price: price}
            )
            db.session.commit()
            product = Product_info.query.filter(Product_info.name == name).first()
        else:
            abort(400)
        return jsonify(product.serialized)


@product_bp.route("/sellprice/", methods=["PUT"])
def product_sellprice():
    if request.method == "PUT":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        price = request.args.get("price", None)
        if price is None:
            abort(400)
        elif plu is not None:
            Product_info.query.filter(Product_info.plu == plu).update(
                {Product_info.selling_price: price}
            )
            db.session.commit()
            product = Product_info.query.filter(Product_info.plu == plu).first()
        elif name is not None:
            Product_info.query.filter(Product_info.name == name).update(
                {Product_info.selling_price: price}
            )
            db.session.commit()
            product = Product_info.query.filter(Product_info.name == name).first()
        else:
            abort(400)
        return jsonify(product.serialized)
