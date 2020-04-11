from flask import Blueprint, request, jsonify, abort
from models import Product, Transaction
from app import db

# Define the blueprint
inventory_bp = Blueprint("inventory", __name__)


def getCounts(result):
    data = []
    if len(result) > 0:
        name = result[0]["name"]
        plu = result[0]["plu"]
        count = 1
        for i in range(1, len(result)):
            if name == result[i]["name"]:
                count = count + 1
            else:
                data.append({"plu": plu, "name": name, "count": count})
                name = result[i]["name"]
                plu = result[i]["plu"]
                count = 1
        data.append({"plu": plu, "name": name, "count": count})
    return data


# Define the routes
@inventory_bp.route("/", methods=["GET"])
def inventory():
    if request.method == "GET":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        if plu is not None:
            products = Product.query.filter(
                (Product.plu == plu) & (Product.transaction_id == None)
            ).order_by(Product.name)
            return jsonify(getCounts([product.serialized for product in products])[0])
        elif name is not None:
            products = Product.query.filter(
                (Product.name == name) & (Product.transaction_id == None)
            ).order_by(Product.name)
            return jsonify(getCounts([product.serialized for product in products])[0])
        else:
            products = Product.query.filter(Product.transaction_id == None).order_by(
                Product.name
            )
            result = [product.serialized for product in products]
            return jsonify({"products": getCounts(result)})
