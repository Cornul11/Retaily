from flask import Blueprint, request, jsonify, abort
from models import Product, Transaction, ProductInfo
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
            product = ProductInfo.query.filter(ProductInfo.plu == plu).first()
        elif name is not None:
            product = ProductInfo.query.filter(ProductInfo.name == name).first()
        else:
            products = ProductInfo.query
            if products is not None:
                return {"products": [product.serialized for product in products]}
        if product is not None:
            return jsonify(product.serialized)
        abort(400)

@product_bp.route("/buyprice/", methods=["PUT"])
def product_buyprice():
    if request.method == "PUT":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        price = request.args.get("price", None)
        if price is None:
            abort(400)
        elif plu is not None:
            ProductInfo.query.filter(ProductInfo.plu == plu).update(
                {ProductInfo.buying_price: price}
            )
            db.session.commit()
            product = ProductInfo.query.filter(ProductInfo.plu == plu).first()
        elif name is not None:
            ProductInfo.query.filter(ProductInfo.name == name).update(
                {ProductInfo.buying_price: price}
            )
            db.session.commit()
            product = ProductInfo.query.filter(ProductInfo.name == name).first()
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
            ProductInfo.query.filter(ProductInfo.plu == plu).update(
                {ProductInfo.selling_price: price}
            )
            db.session.commit()
            product = ProductInfo.query.filter(ProductInfo.plu == plu).first()
        elif name is not None:
            ProductInfo.query.filter(ProductInfo.name == name).update(
                {ProductInfo.selling_price: price}
            )
            db.session.commit()
            product = ProductInfo.query.filter(ProductInfo.name == name).first()
        else:
            abort(400)
        return jsonify(product.serialized)
