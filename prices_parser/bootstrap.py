import time
import sys
import pandas as pd
import configparser
import mysql
from mysql.connector import Error


def load_credentials():
    config = configparser.ConfigParser()
    config.read("credentials.ini")
    db_credentials = {'username': config["database"]["db_username"],
                      'password': config["database"]["db_password"],
                      'hostname': config["database"]["db_hostname"],
                      'database': config["database"]["db_database"]}
    return db_credentials


def initialize_connection():
    db_credentials = load_credentials()
    connection = mysql.connector.connect(host=db_credentials['hostname'],
                                         password=db_credentials['password'],
                                         user=db_credentials['username'],
                                         database=db_credentials['database'])
    return connection


def parse_file(file_name):
    data = pd.read_csv(file_name, sep=';', quotechar='"', encoding='latin-1', decimal=',')
    print(len(data))
    print(data.keys())
    print(data['Artikel  '][0])
    connection = initialize_connection()
    cursor = connection.cursor(buffered=True)
    mysql_select_query = """SELECT * FROM product_info"""
    cursor.execute(mysql_select_query)
    if cursor.rowcount == 0:
        print('some error has happened, lul')
    else:
        records = cursor.fetchall()
        for row in records:
            product_plu = row[0]
            count = data[data['Artikel  '] == product_plu]['Aantal']
            total = data[data['Artikel  '] == product_plu]['Ink-Bed.']
            if len(count) != 0 and len(total) != 0:
                print(count, ' ', total)
                print('PLU = ', product_plu)
                print(count)
                print(total)
                count = count.values[0]
                total = total.values[0]
                buying_price = total / count
                print('buying price for ', row[1], ' = ', str(buying_price))
                mysql_update_query = ("""UPDATE product_info SET buying_price = '%f' WHERE plu = '%d'"""
                                      % (
                                          buying_price,
                                          row[0]
                                      ))
                cursor.execute(mysql_update_query)
                connection.commit()
                print(count, ' ', total)
    connection.close()

def process(file_name):
    print('Parsing ', file_name)
    parse_file(file_name)


if __name__ == '__main__':
    print('Price parser started at: ', time.ctime())
    process(sys.argv[1])
