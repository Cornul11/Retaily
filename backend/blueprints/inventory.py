from flask import Blueprint, request, jsonify
from models import Product, Transaction
from app import db

# Define the blueprint
inventory_bp = Blueprint("inventory", __name__)

# Define the routes
@inventory_bp.route("/", methods=["GET"])
def inventory():
    if request.method == "GET":
        products = Product.query.filter(Product.transaction_id == None).order_by(
            Product.name
        )
        return jsonify({"products": [product.serialized for product in products]})
