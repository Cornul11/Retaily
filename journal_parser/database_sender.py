import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode

def send_product_info(cp):
    try:
        connection = mysql.connector.connect()
        print('card_usage_date = ', cp['cp_date'])
        print('card_transaction_id = ', cp['cp_transaction'])
        print('card_total_amount = ', cp['cp_drawer_amount'])
        print('card_serial =', cp['cp_card_serial_number'])
        from datetime import datetime
        datetim = datetime.strptime(cp['cp_date'], '%d/%m/%Y %H:%M')
        mysql_insert_query = """INSERT INTO transaction (date_time, receipt_number, total_amount, card_serial) VALUES ('%s', '%d', '%f', '%d')""" % (
            datetim, int(cp['cp_transaction']), float(cp['cp_drawer_amount'].replace(',', '.')),
            int(cp['cp_card_serial_number']))
        cursor = connection.cursor()
        cursor.execute(mysql_insert_query)
        connection.commit()
        print(cursor.rowcount, 'Record inserted succesfully')
        cursor.close()
    except mysql.connector.Error as error:
        print('Failed to insert record into table {}'.format(error))
    finally:
        if connection.is_connected():
            connection.close()
            print('Mysql connection closed')


def send_transaction_info(cp):
    try:
        connection = mysql.connector.connect()
        print('card_usage_date = ', cp['cp_date'])
        print('card_transaction_id = ', cp['cp_transaction'])
        print('card_total_amount = ', cp['cp_drawer_amount'])
        print('card_serial =', cp['cp_card_serial_number'])
        from datetime import datetime
        datetim = datetime.strptime(cp['cp_date'], '%d/%m/%Y %H:%M')
        mysql_insert_query = """INSERT INTO transaction (date_time, receipt_number, total_amount, card_serial) VALUES ('%s', '%d', '%f', '%d')""" % (
            datetim, int(cp['cp_transaction']), float(cp['cp_drawer_amount'].replace(',', '.')),
            int(cp['cp_card_serial_number']))
        cursor = connection.cursor()
        cursor.execute(mysql_insert_query)
        connection.commit()
        print(cursor.rowcount, 'Record inserted succesfully')
        cursor.close()
    except mysql.connector.Error as error:
        print('Failed to insert record into table {}'.format(error))
    finally:
        if connection.is_connected():
            connection.close()
            print('Mysql connection closed')
