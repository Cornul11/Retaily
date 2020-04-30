import sys
import mysql
import configparser
from mysql.connector import Error

db_credentials = {}


def create_uri():
    global db_credentials
    config = configparser.ConfigParser()
    config.read("credentials.ini")
    db_credentials = {'username': config["database"]["db_username"],
                      'password': config["database"]["db_password"],
                      'hostname': config["database"]["db_hostname"],
                      'database': config["database"]["db_database"]}


def send_product_info(product):
    try:
        connection = mysql.connector.connect(host=db_credentials['hostname'],
                                             password=db_credentials['password'],
                                             user=db_credentials['username'],
                                             database=db_credentials['database'])

        mysql_select_query = """SELECT * FROM product_info WHERE plu = '%d'""" % int(
            product["product_plu"]
        )
        cursor = connection.cursor(buffered=True)
        cursor.execute(mysql_select_query)
        if cursor.rowcount == 0:
            mysql_insert_query = (
                    """INSERT INTO product_info (plu, name, selling_price) VALUES ('%d', '%s', '%f')"""
                    % (
                        int(product["product_plu"]),
                        product["product_name"],
                        float(product["product_price"].replace(",", ".")),
                    )
            )
            cursor.execute(mysql_insert_query)
            connection.commit()
            print(cursor.rowcount, "Record inserted successfully")
            cursor.close()
        else:
            print("already in the database")
            cursor.close()
    except Error as error:
        print("Failed to insert record into table {}".format(error), file=sys.stderr)
    finally:
        if connection.is_connected():
            connection.close()
            print("Mysql connection closed")


def send_transaction_info(cp):
    try:
        connection = mysql.connector.connect()
        print("card_usage_date = ", cp["cp_date"])
        print("card_transaction_id = ", cp["cp_transaction"])
        print("card_total_amount = ", cp["cp_drawer_amount"])
        print("card_serial =", cp["cp_card_serial_number"])
        from datetime import datetime

        datetim = datetime.strptime(cp["cp_date"], "%d/%m/%Y %H:%M")
        mysql_insert_query = (
                """INSERT INTO transaction (date_time, receipt_number, total_amount, card_serial) VALUES ('%s', '%d', '%f', '%d')"""
                % (
                    datetim,
                    int(cp["cp_transaction"]),
                    float(cp["cp_drawer_amount"].replace(",", ".")),
                    int(cp["cp_card_serial_number"]),
                )
        )
        cursor = connection.cursor()
        cursor.execute(mysql_insert_query)
        connection.commit()
        print(cursor.rowcount, "Record inserted succesfully")
        cursor.close()
    except mysql.connector.Error as error:
        print("Failed to insert record into table {}".format(error))
    finally:
        if connection.is_connected():
            connection.close()
            print("Mysql connection closed")
