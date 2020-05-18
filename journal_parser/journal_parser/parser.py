import logging
import sys
from typing import Dict, Tuple, Optional, List

from journal_parser.database_sender import DataSender

logger = logging.getLogger(__name__)


def parse_file(filepath: str) -> object:
    data_sender = DataSender()
    logger.info('Parsing and sending transactions to the database from \'%s\'', filepath)

    records = []

    # these journal records can be ignored as they contain no valuable information for our scope
    record_ignore_words = ['Cancellation', 'Customer', 'InOutPayment', 'ReportRecord',
                           'JournalRecordNumberReset', 'NoSale', 'DataClear', 'NeutralList']

    # fix for various products that have stars in their naming and break the tokenizing of products
    record_replace_strings = {'*FOUT NR*)': '[FOUT NR])',
                              '*PET*': 'PET',
                              '*P*': 'P',
                              '*PROMO*': 'PROMO',
                              '*M*': 'M',
                              '*S*': 'S',
                              '*KP*': 'KP',
                              '1* 500GR': '1 500GR'}

    with open(filepath, 'r') as file_object:
        file_contents = file_object.read().strip()

        # replaces corrupted product names
        for key, value in record_replace_strings.items():
            file_contents = file_contents.replace(key, value)

        journal_records = file_contents.split('===')[1:]

        for journal_record in journal_records:

            if 'Aborted Sale' in journal_record:
                continue
            splitter_string = '---\n---'
            # This code is required if we want to store data about the aborted sales, at this moment, we don't
            """
            if 'Aborted Sale' in journal_record:
                splitter_string = '---\n'
                aborted_sale = True
            else:
                splitter_string = '---\n---'
                aborted_sale = False
            """
            temp_split = journal_record.split(splitter_string)

            # Parsing the intro part containing the basic data about the record
            record_no, record_date, record_cashier, record_type = parse_journal_data(
                temp_split[0]
            )

            # Parsing the purchased products
            if any(elem in journal_record for elem in record_ignore_words):
                continue
            else:
                products = parse_components(temp_split[1], filepath, data_sender)

            local_record = {
                'journal_record_no': record_no,
                'journal_record_date': record_date,
                'journal_record_cashier': record_cashier,
                'journal_record_type': record_type,
                'journal_record_products': products,
            }

            data_sender.send_transaction_info(local_record)

            records.append(dict(local_record))
    del data_sender
    return records


def parse_journal_data(string: str) -> Tuple[Optional[str], Optional[str], Optional[str], Optional[str]]:
    journal_record_no = None
    journal_record_date = None
    journal_record_cashier = None
    journal_record_type = None

    for line in string.split('\n'):
        if 'Journal Record' in line:
            split_line = line.rsplit('/', 1)
            journal_record_no = split_line[0].strip().replace('Journal Record: ', '')
            journal_record_date = split_line[1].strip()
        if 'Cashier' in line:
            journal_record_cashier = line.split(':')[1].strip()
        if 'Record Type' in line:
            journal_record_type = line.split(':')[1].strip()

    return (
        journal_record_no,
        journal_record_date,
        journal_record_cashier,
        journal_record_type,
    )


def parse_components(string: str, filename: str, data_sender: DataSender) -> List[dict]:
    products = []
    ignored_components = ['ItemNewPriceDiscountSaleItem', 'SubTotalPercentDiscountSaleItem', 'CouponCodeItem',
                          'ItemFixedAmountDiscountSaleItem', 'ProductReturn', 'ItemPercentDiscountSaleItem']

    for product in string.strip().split('*')[1:]:
        if 'PaymentRoundingCompensation' in product:
            prc = parse_payment_rounding(product)

            products.append(dict(prc))

        elif 'SubtotalSaleItem' in product:
            ssi = parse_subtotal(product)

            products.append(dict(ssi))

        elif 'Vic107Payment' in product:
            cp = parse_card_payment(product)

            products.append(dict(cp))

        elif 'MixAndMatchDiscountItem' in product:
            mm = parse_mix_match(product)

            products.append(dict(mm))

        elif 'CashWithdrawal' in product:
            # cw stands for CashWithdrawal
            cw = parse_cash_withdrawal(product)

            products.append(dict(cw))

        elif 'CashPayment' in product:
            cp = parse_cash_payment(product)

            products.append(dict(cp))

        elif 'PLU' in product:
            local_product = parse_product(product)
            data_sender.send_product_info(local_product)
            products.append(dict(local_product))

        elif any(elem in product for elem in ignored_components):
            # ignore various components of the journal record
            continue

        else:
            print('NEW FORMAT in ' + filename, file=sys.stderr)
            sys.exit(1)
    return products


def parse_product(product: str) -> Dict:
    product_plu = None
    product_name = None
    product_amount = None
    product_price = None
    product_discount = None
    product_total = None
    product_canceled = False

    line_num = 0

    for line in product.strip().split('\n'):
        if 'PLU #' in line:
            if 'CANCELED' in line:
                product_canceled = True
                product_plu = line.split('#')[1].strip().split(' ')[0]
            else:
                product_plu = line.split('#')[1].strip()
        elif ' x ' in line:
            price_and_amount_line = line.strip().split('x')
            product_amount = price_and_amount_line[0]
            product_price = price_and_amount_line[1]
        elif 'Discount' in line:
            discount_and_total_line = line.split('Total:')
            product_discount = (
                discount_and_total_line[0].replace('Discount: ', '').strip()
            )
            product_total = discount_and_total_line[1].strip()
        elif line_num == 1:
            product_name = line.strip()

        line_num += 1

    local_product = {
        'product_plu': product_plu,
        'product_canceled': product_canceled,
        'product_name': product_name,
        'product_amount': product_amount,
        'product_price': product_price,
        'product_discount': product_discount,
        'product_total': product_total,
    }
    return local_product


PAYMENT_ROUNDING_ITEMS = {
    'prc_amount': 'Amount',
    'prc_payment_no': 'PaymentNumber',
    'prc_cancelable': 'IsCancelable',
}


def parse_payment_rounding(product: str) -> Dict:
    # prc stands for PaymentRoundingCompensation
    prc = dict.fromkeys(PAYMENT_ROUNDING_ITEMS.keys())

    for line in product.splitlines():
        for key, value in PAYMENT_ROUNDING_ITEMS.items():
            if value in line:
                prc[key] = line.split(':')[1].strip()
    return prc


SUBTOTAL_SALE_ITEMS = {
    'ssi_value': 'Value',
    'ssi_use_swiss_rounding': 'UseSwissRounding',
    'ssi_cancelable': 'IsCancelable',
}


def parse_subtotal(product: str) -> Dict:
    # ssi stands for SubtotalSaleItem
    ssi = dict.fromkeys(SUBTOTAL_SALE_ITEMS.keys())

    for line in product.splitlines():
        for key, value in SUBTOTAL_SALE_ITEMS.items():
            if value in line:
                ssi[key] = line.split(':')[1].strip()
    return ssi


CARD_PAYMENT_ITEMS = {
    'card_payment_poi': 'POI',
    'card_payment_terminal': 'Terminal',
    'card_payment_merchant': 'Merchant',
    'card_payment_period': 'Periode',
    'card_payment_transaction': 'Transactie',
    'card_payment_card': 'Kaart',
    'card_payment_card_serial_number': 'Kaartserienummer',
    'card_payment_date': 'Datum',
    'card_payment_authorisation_code': 'Autorisatiecode',
    'card_payment_total': ' Amount',
    'card_payment_card_type_id': 'CardTypeId',
    'card_payment_card_type_text': 'CardTypeText',
    'card_payment_drawer_amount': 'DrawerAmount',
    'card_payment_drawer_id': 'DrawerId',
    'card_payment_cancelable': 'Cancelable',
    'card_payment_card_type': 'Leesmethode',
}


def parse_card_payment(product: str) -> Dict:
    # cp stands for CardPayment
    cp = dict.fromkeys(CARD_PAYMENT_ITEMS.keys())

    for line in product.splitlines():
        for key, value in CARD_PAYMENT_ITEMS.items():
            if value in line:
                cp[key] = line.split(': ')[-1].strip()
    return cp


MIX_MATCH_ITEMS = {
    'mm_discount_text': 'DiscountText',
    'mm_discount_amount': 'DiscountAmount',
    'mm_discount_type_name': 'DiscountTypeName',
    'mm_number': 'MixMatchNumber',
    'mm_discount_number': 'DiscountNumber',
    'mm_cancelable': 'IsCancelable',
}


def parse_mix_match(product: str) -> Dict:
    # mm stands for MixAndMatchDiscountItem
    mm = dict.fromkeys(MIX_MATCH_ITEMS.keys())

    for line in product.splitlines():
        for key, value in MIX_MATCH_ITEMS.items():
            if value in line:
                mm[key] = line.split(':')[1].strip()
    return mm


CASH_WITHDRAWAL_ITEMS = {
    'cw_canceled': 'CANCELED',
    'cw_withdrawal_amount': 'WithdrawalAmount',
    'cw_drawer_amount': 'DrawerAmount',
    'cw_gross_amount': 'GrossAmount',
    'cw_drawer_id': 'DrawerId',
    'cw_drawer_number': 'DrawerNumber',
    'cw_amount': ' Amount',
    'cw_cancelable': 'IsCancelable',
}


def parse_cash_withdrawal(product: str) -> Dict:
    # cw stands for CashWithdrawal
    cw = dict.fromkeys(CASH_WITHDRAWAL_ITEMS.keys())

    for line in product.splitlines():
        for key, value in CASH_WITHDRAWAL_ITEMS.items():
            if value in line:
                if value == 'CANCELED':
                    cw[key] = True
                else:
                    cw[key] = line.split(':')[1].strip()
    return cw


CASH_PAYMENT_ITEMS = {
    'cash_payment_text': 'Text',
    'cash_payment_is_change': 'IsChange',
    'cash_payment_amount': ' Amount',
    'cash_payment_drawer_amount': 'DrawerAmount',
    'cash_payment_number': ' Number',
    'cash_payment_drawer_id': 'DrawerId',
    'cash_payment_drawer_number': 'DrawerNumber',
    'cash_payment_cancelable': 'IsCancelable',
}


def parse_cash_payment(product: str) -> Dict:
    # cp stands for CashPayment
    cp = dict.fromkeys(CASH_PAYMENT_ITEMS.keys())

    for line in product.splitlines():
        for key, value in CASH_PAYMENT_ITEMS.items():
            if value in line:
                cp[key] = line.split(':')[1].strip()
    return cp
