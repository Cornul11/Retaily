from flask import Blueprint, request, jsonify, abort, make_response
from models import ProductInfo


def pluError(plu):
    product = ProductInfo.query.filter(ProductInfo.plu == plu).first()
    if product is None:
        response = make_response(
            jsonify(message="EAN code niet gevonden."), 404)
        abort(response)
    return product


def nameError(name):
    product = ProductInfo.query.filter(
        ProductInfo.name == name).first()
    if product is None:
        response = make_response(
            jsonify(message="Product naam niet gevonden."), 404)
        abort(response)
    return product


def undefinedError():
    response = make_response(
        jsonify(message="Er is iets misgegaan."), 404)
    abort(response)


def serverError():
    response = make_response(
        jsonify(message="Er is iets misgegaan."), 500)
    abort(response)
