from flask import Blueprint, request, jsonify, abort
from models import Product, Transaction
from app import db
from dateutil.relativedelta import *
import datetime


time_format = "%Y-%m-%d %H:%M"

# Define the blueprint
sales_bp = Blueprint("sales", __name__)


def get_sales(items, start, end, interval, product):
    data = []
    count = 0
    for item in items:
        if product:
            time = item.Transaction.serialized["date_time"]
        else:
            time = item.serialized["date_time"]
        while time > (start + interval):
            data.append(
                {"t": (start + (interval / 2)).strftime(time_format), "y": count}
            )
            count = 0
            start = start + interval
        count += 1
    data.append({"t": (start + (interval / 2)).strftime(time_format), "y": count})
    start = start + interval
    while start < end:
        data.append({"t": (start + (interval / 2)).strftime(time_format), "y": 0})
        start = start + interval
    return data


def get_count(plu, name, days, end):
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
        ).count()
    else:
        return (
            db.session.query(Product, Transaction)
            .join(Transaction)
            .filter(
                (Product.name == name)
                & (Transaction.date_time >= start)
                & (Transaction.date_time <= end)
            )
        ).count()


# Define the routes
@sales_bp.route("/", methods=["GET"])
def sales():
    if request.method == "GET":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        start = request.args.get("start", None)
        end = request.args.get("end", None)
        interval = request.args.get("interval", None)

        try:
            start = datetime.datetime.strptime(start, "%Y-%m-%d")
            end = datetime.datetime.strptime(end, "%Y-%m-%d")
            if interval == "half_an_hour":
                interval = datetime.timedelta(minutes=30)
                end += datetime.timedelta(days=1)
            elif interval == "hour":
                interval = datetime.timedelta(hours=1)
                end += datetime.timedelta(days=1)
            elif interval == "day":
                interval = datetime.timedelta(days=1)
                end += datetime.timedelta(days=1)
            elif interval == "week":
                interval = datetime.timedelta(weeks=1)
                end += datetime.timedelta(weeks=1)
            elif interval == "month":
                interval = relativedelta(months=1)
                end += relativedelta(months=1)
            else:
                abort(400)
        except:
            abort(400)
        if plu is None and name is None:
            items = (
                db.session.query(Transaction)
                .filter(
                    (Transaction.date_time >= start) & (Transaction.date_time <= end)
                )
                .order_by(Transaction.date_time)
            )
            return jsonify(get_sales(items, start, end, interval, False))
        elif plu is not None:
            items = (
                db.session.query(Product, Transaction)
                .join(Transaction)
                .filter(
                    (Product.plu == plu)
                    & (Transaction.date_time >= start)
                    & (Transaction.date_time <= end)
                )
                .order_by(Transaction.date_time)
            )
        else:
            items = (
                db.session.query(Product, Transaction)
                .join(Transaction)
                .filter(
                    (Product.name == name)
                    & (Transaction.date_time >= start)
                    & (Transaction.date_time <= end)
                )
            )
        return jsonify(get_sales(items, start, end, interval, True))


@sales_bp.route("/quick/", methods=["GET"])
def quick():
    if request.method == "GET":
        plu = request.args.get("plu", None)
        name = request.args.get("name", None)
        if plu is None and name is None:
            abort(400)
        end = datetime.datetime.now()
        return jsonify(
            {
                "sales_last_week": get_count(plu, name, 7, end),
                "sales_last_month": get_count(plu, name, 30, end),
                "sales_last_quarter": get_count(plu, name, 90, end),
                "sales_last_year": get_count(plu, name, 365, end),
            }
        )
