import pprint
import sys
import time
import mysql.connector


def parse_file(filepath):
    records = []
    with open(filepath, "r") as file_object:
        file_contents = file_object.read().strip()

        # fix for *FOUT NR* getting filtered out as a separate product because of the stars
        file_contents = file_contents.replace("*FOUT NR*)", "[FOUT NR])")

        journal_records = file_contents.split("===")[1:-1]

        for journal_record in journal_records:
            if "Aborted Sale" in journal_record:
                splitter_string = "---\n"
                aborted_sale = True
            else:
                splitter_string = "---\n---"
                aborted_sale = False

            temp_split = journal_record.split(splitter_string)

            # Parsing the intro part containing the basic data about the record
            record_no, record_date, record_cashier, record_type = parse_journal_data(
                temp_split[0]
            )

            # Parsing the purchased products
            if "NoSale" in journal_record:
                products = []
            elif "NeutralList" in journal_record:
                neutral_list_split = temp_split[0].split("---\n")
                products = parse_components(neutral_list_split[2])
            elif "ReportRecord" in journal_record:
                # these can supposedly be ignored?
                pass
            elif aborted_sale:
                products = parse_components(temp_split[2])
            else:
                products = parse_components(temp_split[1])

            local_record = {
                "journal_record_no": record_no,
                "journal_record_date": record_date,
                "journal_record_cashier": record_cashier,
                "journal_record_type": record_type,
                "journal_record_aborted": aborted_sale,
                "journal_record_products": products,
            }

            records.append(dict(local_record))

    return records


def parse_journal_data(string):
    journal_record_no = None
    journal_record_date = None
    journal_record_cashier = None
    journal_record_type = None

    for line in string.split("\n"):
        if "Journal Record" in line:
            split_line = line.rsplit("/", 1)
            journal_record_no = split_line[0].strip().replace("Journal Record: ", "")
            journal_record_date = split_line[1].strip()
        if "Cashier" in line:
            journal_record_cashier = line.split(":")[1].strip()
        if "Record Type" in line:
            journal_record_type = line.split(":")[1].strip()

    return (
        journal_record_no,
        journal_record_date,
        journal_record_cashier,
        journal_record_type,
    )


def parse_components(string):
    products = []

    for product in string.strip().split("*")[1:]:
        if "PaymentRoundingCompensation" in product:
            prc = parse_payment_rounding(product)

            products.append(dict(prc))

        elif "SubtotalSaleItem" in product:
            ssi = parse_subtotal(product)

            products.append(dict(ssi))

        elif "Vic107Payment" in product:
            cp = parse_card_payment(product)

            products.append(dict(cp))

        elif "MixAndMatchDiscountItem" in product:
            mm = parse_mix_match(product)

            products.append(dict(mm))

        elif "CashWithdrawal" in product:
            # cw stands for CashWithdrawal
            cw = parse_cash_withdrawal(product)

            products.append(dict(cw))

        elif "CashPayment" in product:
            cp = parse_cash_payment(product)

            products.append(dict(cp))

        elif "PLU" in product:
            local_product = parse_product(product)

            products.append(dict(local_product))

        else:
            print("NEW FORMAT!", file=sys.stderr)
    return products


def parse_product(product):
    product_plu = None
    product_name = None
    product_amount = None
    product_price = None
    product_discount = None
    product_total = None
    product_canceled = False

    line_num = 0

    for line in product.strip().split("\n"):
        if "PLU" in line:
            if "CANCELED" in line:
                product_canceled = True
                product_plu = line.split("#")[1].strip().split(" ")[0]
            else:
                product_plu = line.split("#")[1].strip()
        elif " x " in line:
            price_and_amount_line = line.strip().split("x")
            product_amount = price_and_amount_line[0]
            product_price = price_and_amount_line[1]
        elif "Discount" in line:
            discount_and_total_line = line.split("Total:")
            product_discount = (
                discount_and_total_line[0].replace("Discount: ", "").strip()
            )
            product_total = discount_and_total_line[1].strip()
        elif line_num == 1:
            product_name = line.strip()

        line_num += 1

    local_product = {
        "product_plu": product_plu,
        "product_canceled": product_canceled,
        "product_name": product_name,
        "product_amount": product_amount,
        "product_price": product_price,
        "product_discount": product_discount,
        "product_total": product_total,
    }
    return local_product


PAYMENT_ROUNDING_ITEMS = {
    "prc_amount": "Amount",
    "prc_payment_no": "PaymentNumber",
    "prc_cancelable": "IsCancelable",
}


def parse_payment_rounding(product):
    # prc stands for PaymentRoundingCompensation
    prc = dict.fromkeys(PAYMENT_ROUNDING_ITEMS.keys())

    for line in product.splitlines():
        for key, value in PAYMENT_ROUNDING_ITEMS.items():
            if value in line:
                prc[key] = line.split(":")[1].strip()
    return prc


SUBTOTAL_SALE_ITEMS = {
    "ssi_value": "Value",
    "ssi_use_swiss_rounding": "UseSwissRounding",
    "ssi_cancelable": "IsCancelable",
}


def parse_subtotal(product):
    # ssi stands for SubtotalSaleItem
    ssi = dict.fromkeys(SUBTOTAL_SALE_ITEMS.keys())

    for line in product.splitlines():
        for key, value in SUBTOTAL_SALE_ITEMS.items():
            if value in line:
                ssi[key] = line.split(":")[1].strip()
    return ssi


CARD_PAYMENT_ITEMS = {
    "cp_poi": "POI",
    "cp_terminal": "Terminal",
    "cp_merchant": "Merchant",
    "cp_period": "Periode",
    "cp_transaction": "Transactie",
    "cp_card": "Kaart",
    "cp_card_serial_number": "Kaartserienummer",
    "cp_date": "Datum",
    "cp_authorisation_code": "Autorisatiecode",
    "cp_total": "Autorisatiecode",
    "cp_card_type_id": "CardTypeId",
    "cp_card_type_text": "CardTypeText",
    "cp_drawer_amount": "DrawerAmount",
    "cp_drawer_id": "DrawerId",
    "cp_cancelable": "Cancelable",
    "cp_card_type": "Leesmethode",
}


def parse_card_payment(product):
    # cp stands for CardPayment
    cp = dict.fromkeys(CARD_PAYMENT_ITEMS.keys())

    for line in product.splitlines():
        for key, value in CARD_PAYMENT_ITEMS.items():
            if value in line:
                cp[key] = line.split(": ")[-1].strip()
    # from mysql.connector import Error
    # from mysql.connector import errorcode
    # try:
    #     connection = mysql.connector.connect(host='remotemysql.com',
    #                                          database='tm69H1sxd0',
    #                                          user='tm69H1sxd0',
    #                                          password='xnSlasPerh')
    #     print('card_usage_date = ', cp['cp_date'])
    #     print('card_transaction_id = ', cp['cp_transaction'])
    #     print('card_total_amount = ', cp['cp_drawer_amount'])
    #     print('card_serial =', cp['cp_card_serial_number'])
    #     from datetime import datetime
    #     datetim = datetime.strptime(cp['cp_date'], '%d/%m/%Y %H:%M')
    #     mysql_insert_query = """INSERT INTO transaction (date_time, receipt_number, total_amount, card_serial) VALUES ('%s', '%d', '%f', '%d')""" % (
    #         datetim, int(cp['cp_transaction']), float(cp['cp_drawer_amount'].replace(',', '.')), int(cp['cp_card_serial_number']))
    #     cursor = connection.cursor()
    #     cursor.execute(mysql_insert_query)
    #     connection.commit()
    #     print(cursor.rowcount, "Record inserted succesfully")
    #     cursor.close()
    # except mysql.connector.Error as error:
    #     print("Failed to insert record into table {}".format(error))
    # finally:
    #     if connection.is_connected():
    #         connection.close()
    #         print('Mysql connection closed')
    return cp


MIX_MATCH_ITEMS = {
    "mm_discount_text": "DiscountText",
    "mm_discount_amount": "DiscountAmount",
    "mm_discount_type_name": "DiscountTypeName",
    "mm_number": "MixMatchNumber",
    "mm_discount_number": "DiscountNumber",
    "mm_cancelable": "IsCancelable",
}


def parse_mix_match(product):
    # mm stands for MixAndMatchDiscountItem
    mm = dict.fromkeys(MIX_MATCH_ITEMS.keys())

    for line in product.splitlines():
        for key, value in MIX_MATCH_ITEMS.items():
            if value in line:
                mm[key] = line.split(":")[1].strip()
    return mm


CASH_WITHDRAWAL_ITEMS = {
    "cw_canceled": "CANCELED",
    "cw_withdrawal_amount": "WithdrawalAmount",
    "cw_drawer_amount": "DrawerAmount",
    "cw_gross_amount": "GrossAmount",
    "cw_drawer_id": "DrawerId",
    "cw_drawer_number": "DrawerNumber",
    "cw_amount": " Amount",
    "cw_cancelable": "IsCancelable",
}


def parse_cash_withdrawal(product):
    # cw stands for CashWithdrawal
    cw = dict.fromkeys(CASH_WITHDRAWAL_ITEMS.keys())

    for line in product.splitlines():
        for key, value in CASH_WITHDRAWAL_ITEMS.items():
            if value in line:
                if value is "CANCELED":
                    cw[key] = True
                else:
                    cw[key] = line.split(":")[1].strip()
    return cw


CASH_PAYMENT_ITEMS = {
    "cp_text": "Text",
    "cp_is_change": "IsChange",
    "cp_amount": " Amount",
    "cp_drawer_amount": "DrawerAmount",
    "cp_number": " Number",
    "cp_drawer_id": "DrawerId",
    "cp_drawer_number": "DrawerNumber",
    "cp_cancelable": "IsCancelable",
}


def parse_cash_payment(product):
    # cp stands for CashPayment
    cp = dict.fromkeys(CASH_PAYMENT_ITEMS.keys())

    for line in product.splitlines():
        for key, value in CASH_PAYMENT_ITEMS.items():
            if value in line:
                cp[key] = line.split(":")[1].strip()
    return cp


start_time = time.time()
local_data = parse_file("journal_parser/journal_2017-09-01_19-30.txt")

# debug info
print(
    "parsed %d receipts in %s seconds" % (len(local_data), (time.time() - start_time))
)

pp = pprint.PrettyPrinter(indent=4, width=100)
pp.pprint(local_data)
