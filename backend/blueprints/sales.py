from flask import Blueprint, request, jsonify, abort
from models import Product, Transaction
from app import db

# Define the blueprint
sales_bp = Blueprint("sales", __name__)

# Define the routes
@sales_bp.route("/", methods=["GET"])
def sales():
    plu = request.args.get("plu", None)
    name = request.args.get("name", None)
    dt1 = request.args.get("dt1", None)
    dt2 = request.args.get("dt2", None)
    if dt1 is None or dt2 is None:
        abort(400)
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
