from flask import Blueprint, request, jsonify, abort
from models import Product, Transaction
from app import db
import datetime

# Define the blueprint
koppelverkoop_bp = Blueprint("koppelverkoop", __name__)


def getKoppelproducts(Transaction):
    data = []
    data.append(Transaction.getProducts())
    return data

# Define the routes
@koppelverkoop_bp.route("/", methods=["GET"])
def koppelproduct():
    if request.method == "GET":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        product = request.args.get("koppeledproduct", None)
        if plu is not None:
            koppelproduct = ProductInfo.query.filter(ProductInfo.plu == plu).first()
        elif name is not None:
            koppelproduct = ProductInfo.query.filter(ProductInfo.name == name).first()
        elif product is not None:
            koppelproduct = ProductInfo.query.filter(Product.koppeledproduct == product).first()
        else:
            abort(400)
        if koppelproduct is not None:
            return jsonify(koppelproduct.serialized)
        abort(400)
