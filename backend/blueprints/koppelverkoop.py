from flask import Blueprint, request, jsonify, abort
from models import Product, Transaction
from app import db
import datetime

# Define the blueprint
koppelverkoop_bp = Blueprint("koppelverkoop", __name__)


#def getKoppelproducts(Transaction):
#    data = []
#    data.append(Transaction.getProducts())
#   return data

def getId(plu, name, days, end):
    start = end - datetime.timedelta(days=days)
    if plu is not None:
        return (
            db.session.query(Product, Transaction)
            .join(Transaction)
            .filter(
                (Product.plu == plu)
                & (Transaction.date_time >= start)
                & (Transaction.date_time <= end)
            )
        )
    else:
        return (
            db.session.query(Product, Transaction)
            .join(Transaction)
            .filter(
                (Product.name == name)
                & (Transaction.date_time >= start)
                & (Transaction.date_time <= end)
            )
        )

@koppelverkoop_bp.route("/test/", methods=["GET"])
def quick():
    if request.method == "GET":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        if plu is None and name is None:
            abort(400)
        end = datetime.datetime.now()
        return jsonify(
            {
                "ids_last_week": getId(plu, name, 7, end),
                "ids_last_month": getId(plu, name, 30, end),
                "ids_last_quarter": getId(plu, name, 90, end),
                "ids_last_year": getId(plu, name, 365, end),
            }
        )
