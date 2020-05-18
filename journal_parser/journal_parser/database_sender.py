import configparser
import logging
import os
import sys
from datetime import datetime

import mysql
from mysql.connector import Error

logger = logging.getLogger(__name__)


def load_credentials():
    config = configparser.ConfigParser()
    config.read("credentials.ini")
    db_credentials = {'username': config["database"]["db_username"],
                      'password': config["database"]["db_password"],
                      'hostname': config["database"]["db_hostname"],
                      'database': config["database"]["db_database"]}
    return db_credentials


class DataSender:
    def __init__(self):
        self.db_credentials = load_credentials()
        self.connection = self.initialize_connection()

    def __del__(self):
        self.close_connection()

    def initialize_connection(self):
        try:
            connection = mysql.connector.connect(host=self.db_credentials['hostname'],
                                                 password=self.db_credentials['password'],
                                                 user=self.db_credentials['username'],
                                                 database=self.db_credentials['database'])
        except mysql.connector.Error as err:
            logger.error('Error while attempting to connect to database: %s', err)
            os._exit(1)
        finally:
            return connection

    def close_connection(self):
        if self.connection.is_connected():
            self.connection.close()

    def send_transaction_info(self, transaction):
        last_query = ''
        try:
            transaction_id = abs(hash(transaction['journal_record_date'] + transaction['journal_record_no']))
            mysql_select_query = last_query = """SELECT * FROM transaction WHERE receipt_number = '%d'""" % transaction_id
            cursor = self.connection.cursor(buffered=True)
            cursor.execute(mysql_select_query)
            if cursor.rowcount == 0:
                transaction_amount = 0
                for product in transaction['journal_record_products']:
                    if 'card_payment_total' in product:
                        transaction_amount = float(product['card_payment_total'].replace(',', '.'))
                        break
                    if 'cash_payment_amount' in product:
                        transaction_amount = float(product['cash_payment_amount'].replace(',', '.'))
                        break
                transaction_datetime = datetime.strptime(transaction['journal_record_date'], '%Y-%m-%d %H:%M:%S')
                mysql_insert_query = last_query = (
                        """INSERT INTO transaction (id, date_time, receipt_number, total_amount) VALUES ('%d', '%s', '%d', '%f')"""
                        % (
                            transaction_id,
                            transaction_datetime,
                            transaction_id,
                            transaction_amount
                        )
                )
                cursor.execute(mysql_insert_query)
                self.connection.commit()
                cursor.close()
            else:
                cursor.close()

            for product in transaction['journal_record_products']:
                if 'product_plu' in product:
                    is_piece = float(product['product_amount'].replace(',', '.')).is_integer()
                    if is_piece:
                        for _ in int(float(product['product_amount'].replace(',', '.'))):
                            mysql_insert_query = last_query = (
                                    """INSERT INTO product (plu, name, selling_price, discount, transaction_id) VALUES ('%d', 
                                    '%s', '%f', '%f', '%d') """
                                    % (
                                        int(product['product_plu']),
                                        product['product_name'],
                                        float(product['product_price'].replace(',', '.')),
                                        float(product['product_discount'].replace(',', '.')),
                                        transaction_id
                                    )
                            )
                            cursor = self.connection.cursor(buffered=True)
                            cursor.execute(mysql_insert_query)
                            self.connection.commit()
                            cursor.close()
                    else:
                        mysql_insert_query = last_query = (
                                """INSERT INTO product (plu, name, selling_price, discount, transaction_id) VALUES ('%d', 
                                '%s', '%f', '%f', '%d') """
                                % (
                                    int(product['product_plu']),
                                    product['product_name'],
                                    float(product['product_price'].replace(',', '.')),
                                    float(product['product_discount'].replace(',', '.')),
                                    transaction_id
                                )
                        )
                        cursor = self.connection.cursor(buffered=True)
                        cursor.execute(mysql_insert_query)
                        self.connection.commit()
                        cursor.close()

        except Error as error:
            logger.error('Error while inserting/selecting transaction data into the database: %s\nWhile executing: %s',
                         error, last_query)
            print("Failed to insert record into table {}".format(error), file=sys.stderr)

    def send_product_info(self, product):
        last_query = ''
        try:
            product_plu = int(product["product_plu"])
            mysql_select_query = last_query = """SELECT * FROM product_info WHERE plu = '%d'""" % product_plu
            cursor = self.connection.cursor(buffered=True)
            cursor.execute(mysql_select_query)
            result = cursor.fetchone()
            product_price = float(product["product_price"].replace(",", "."))
            if result is None:
                product_name = product["product_name"]
                mysql_insert_query = last_query = (
                        """INSERT INTO product_info (plu, name, selling_price) VALUES ('%d', '%s', '%f')"""
                        % (
                            product_plu,
                            product_name,
                            product_price,
                        )
                )
                cursor.execute(mysql_insert_query)
                self.connection.commit()
                cursor.close()
            else:
                # if the price of the product in database differs from the one that the price was sold at,
                # we update the price in the database
                if result[3] != product_price:
                    mysql_update_query = last_query = (
                            """UPDATE product_info SET selling_price = '%d' WHERE plu = '%d'"""
                            % (
                                product_price,
                                product_plu
                            )
                    )
                    cursor.execute(mysql_update_query)
                    self.connection.commit()
                cursor.close()
        except Error as error:
            logger.error('Error while inserting/updating/selecting product data into the database: %s\nWhile '
                         'executing: %s',
                         error, last_query)
            print("Failed to insert record into table {}".format(error), file=sys.stderr)
