import pprint


def parse_file(filepath):
    """

    :param filepath:
    :return:
    """
    records = []
    with open(filepath, 'r') as file_object:
        file_contents = file_object.read().strip()
        journal_records = file_contents.split('===')[1:-1]

        for journal_record in journal_records:
            if 'Aborted Sale' in journal_record:
                splitter_string = '---\n'
                aborted_sale = True
            else:
                splitter_string = '---\n---'
                aborted_sale = False

            temp_splitted = journal_record.split(splitter_string)

            # Parsing the intro part containing the basic data about the record
            record_no, record_date, record_cashier, record_type = parse_journal_data(temp_splitted[0])

            # Parsing the purchased products
            if 'NoSale' in journal_record:
                products = []
                pass
            elif aborted_sale:
                products = parse_products(temp_splitted[2])
            else:
                products = parse_products(temp_splitted[1])

            local_record = {'journal_record_no': record_no,
                            'journal_record_date': record_date,
                            'journal_record_cashier': record_cashier,
                            'journal_record_type': record_type,
                            'journal_record_aborted': aborted_sale,
                            'journal_record_products': products}

            records.append(dict(local_record))

    return records


def parse_journal_data(string):
    journal_record_no = None
    journal_record_date = None
    journal_record_cashier = None
    journal_record_type = None

    for line in string.split('\n'):
        if 'Journal Record' in line:
            splitted_line = line.rsplit('/', 1)
            journal_record_no = splitted_line[0].strip().replace('Journal Record: ', '')
            journal_record_date = splitted_line[1].strip()
        if 'Cashier' in line:
            journal_record_cashier = line.split(':')[1].strip()
        if 'Record Type' in line:
            journal_record_type = line.split(':')[1].strip()

    return journal_record_no, journal_record_date, journal_record_cashier, journal_record_type


def parse_products(string):
    products = []

    for product in string.strip().split('*')[1:]:
        product_plu = None
        product_name = None
        product_amount = None
        product_price = None
        product_discount = None
        product_total = None
        product_canceled = False

        if 'PaymentRoundingCompensation' in product:
            # prc stands for PaymentRoundingCompensation
            prc_amount = None
            prc_payment_no = None
            prc_cancelable = None

            for line in product.strip().split('\n'):
                if 'Amount' in line:
                    prc_amount = line.split(':')[1].strip()
                elif 'PaymentNumber' in line:
                    prc_payment_no = line.split(':')[1].strip()
                elif 'IsCancelable' in line:
                    prc_cancelable = line.split(':')[1].strip()

            prc = {'prc_amount': prc_amount,
                   'prc_payment_no': prc_payment_no,
                   'prc_cancelable': prc_cancelable}

            products.append(dict(prc))

        elif 'SubtotalSaleItem' in product:
            # ssi stands for SubtotalSaleItem
            ssi_value = None
            ssi_use_swiss_rounding = None
            ssi_cancelable = None

            for line in product.strip().split('\n'):
                if 'Value' in line:
                    ssi_value = line.split(':')[1].strip()
                elif 'UseSwissRounding' in line:
                    ssi_use_swiss_rounding = line.split(':')[1].strip()
                elif 'IsCancelable' in line:
                    ssi_cancelable = line.split(':')[1].strip()

            ssi = {'ssi_value': ssi_value,
                   'ssi_use_swiss_rounding': ssi_use_swiss_rounding,
                   'ssi_cancelable': ssi_cancelable}

            products.append(dict(ssi))

        elif 'Vic107Payment' in product:
            # cp stands for cash payment
            cp_poi = None
            cp_terminal = None
            cp_merchant = None
            cp_period = None
            cp_transaction = None
            cp_card = None
            cp_card_serial_number = None
            cp_date = None
            cp_authorisation_code = None
            cp_total = None
            cp_card_type_id = None
            cp_card_type_text = None
            cp_drawer_id = None
            cp_drawer_amount = None
            cp_cancelable = None
            cp_card_type = None

            for line in product.strip().split('\n'):
                if 'POI' in line:
                    cp_poi = line.split(':')[1].strip()
                elif 'Terminal' in line:
                    cp_terminal = line.split(':')[1].strip()
                elif 'Merchant' in line:
                    cp_merchant = line.split(':')[1].strip()
                elif 'Periode' in line:
                    cp_period = line.split(':')[1].strip()
                elif 'Transactie' in line:
                    cp_transaction = line.split(':')[1].strip()
                elif 'Kaart:' in line:
                    cp_card = line.split(':')[1].strip()
                elif 'Kaartserienummer' in line:
                    cp_card_serial_number = line.split(':')[1].strip()
                elif 'Datum' in line:
                    cp_date = line.split(':')[1].strip()
                elif 'Autorisatiecode' in line:
                    cp_authorisation_code = line.split(':')[1].strip()
                elif 'Totaal' in line:
                    cp_total = line.split(':')[1].strip()
                elif 'CardTypeId' in line:
                    cp_card_type_id = line.split(':')[1].strip()
                elif 'CardTypeText' in line:
                    cp_card_type_text = line.split(':')[1].strip()
                elif 'DrawerAmount' in line:
                    cp_drawer_amount = line.split(':')[1].strip()
                elif 'DrawerId' in line:
                    cp_drawer_id = line.split(':')[1].strip()
                elif 'Cancelable' in line:
                    cp_cancelable = line.split(':')[1].strip()
                elif 'Leesmethode' in line:
                    cp_card_type = line.split(':')[1].strip()

            cp = {'cp_poi': cp_poi,
                  'cp_terminal': cp_terminal,
                  'cp_merchant': cp_merchant,
                  'cp_period': cp_period,
                  'cp_transaction': cp_transaction,
                  'cp_card': cp_card,
                  'cp_card_serial_number': cp_card_serial_number,
                  'cp_date': cp_date,
                  'cp_authorisation_code': cp_authorisation_code,
                  'cp_total': cp_total,
                  'cp_card_type_id': cp_card_type_id,
                  'cp_card_type_text': cp_card_type_text,
                  'cp_drawer_id': cp_drawer_id,
                  'cp_drawer_amount': cp_drawer_amount,
                  'cp_cancelable': cp_cancelable,
                  'cp_card_type': cp_card_type}

            products.append(dict(cp))

        elif 'MixAndMatchDiscountItem' in product:
            # mm stands for MixAndMatchDiscountItem
            mm_discount_text = None
            mm_discount_amount = None
            mm_discount_type_name = None
            mm_number = None
            mm_discount_number = None
            mm_cancelable = None

            for line in product.strip().split('\n'):
                if 'DiscountText' in line:
                    mm_discount_text = line.split(':')[1].strip()
                elif 'DiscountAmount' in line:
                    mm_discount_amount = line.split(':')[1].strip()
                elif 'DiscountTypeName' in line:
                    mm_discount_type_name = line.split(':')[1].strip()
                elif 'MixMatchNumber' in line:
                    mm_number = line.split(':')[1].strip()
                elif 'DiscountNumber' in line:
                    mm_discount_number = line.split(':')[1].strip()
                elif 'IsCancelable' in line:
                    mm_cancelable = line.split(':')[1].strip()

            mm = {'mm_discount_text': mm_discount_text,
                  'mm_discount_amount': mm_discount_amount,
                  'mm_discount_type_name': mm_discount_type_name,
                  'mm_number': mm_number,
                  'mm_discount_number': mm_discount_number,
                  'mm_cancelable': mm_cancelable}

            products.append(dict(mm))

        elif 'CashWithdrawal' in product:
            # cw stands for CashWithdrawal
            cw_canceled = None
            cw_withdrawal_amount = None
            cw_drawer_amount = None
            cw_gross_amount = None
            cw_drawer_id = None
            cw_drawer_number = None
            cw_amount = None
            cw_cancelable = None

            for line in product.strip().split('\n'):
                if 'CANCELED' in line:
                    cw_canceled = True
                elif 'WithdrawalAmount' in line:
                    cw_withdrawal_amount = line.split(':')[1].strip()
                elif 'DrawerAmount' in line:
                    cw_drawer_amount = line.split(':')[1].strip()
                elif 'GrossAmount' in line:
                    cw_gross_amount = line.split(':')[1].strip()
                elif 'DrawerId' in line:
                    cw_drawer_id = line.split(':')[1].strip()
                elif 'DrawerNumber' in line:
                    cw_drawer_number = line.split(':')[1].strip()
                elif ' Amount' in line:
                    cw_amount = line.split(':')[1].strip()
                elif 'IsCancelable' in line:
                    cw_cancelable = line.split(':')[1].strip()

            cw = {'cw_canceled': cw_canceled,
                  'cw_withdrawal_amount': cw_withdrawal_amount,
                  'cw_drawer_amount': cw_drawer_amount,
                  'cw_gross_amount': cw_gross_amount,
                  'cw_drawer_id': cw_drawer_id,
                  'cw_drawer_number': cw_drawer_number,
                  'cw_amount': cw_amount,
                  'cw_cancelable': cw_cancelable}

            products.append(dict(cw))

        elif 'CashPayment' in product:
            # cp stands for CashPayment
            cp_text = None
            cp_is_change = None
            cp_amount = None
            cp_drawer_amount = None
            cp_number = None
            cp_drawer_id = None
            cp_drawer_number = None
            cp_cancelable = None

            for line in product.strip().split('\n'):
                if 'Text' in line:
                    cp_text = line.split(':')[1].strip()
                elif 'IsChange' in line:
                    cp_is_change = line.split(':')[1].strip()
                elif ' Amount' in line:
                    cp_amount = line.split(':')[1].strip()
                elif 'DrawerAmount' in line:
                    cp_drawer_amount = line.split(':')[1].strip()
                elif ' Number' in line:
                    cp_number = line.split(':')[1].strip()
                elif 'DrawerId' in line:
                    cp_drawer_id = line.split(':')[1].strip()
                elif 'DrawerNumber' in line:
                    cp_drawer_number = line.split(':')[1].strip()
                elif 'IsCancelable' in line:
                    cp_cancelable = line.split(':')[1].strip()

            cp = {'cp_text': cp_text,
                  'cp_is_change': cp_is_change,
                  'cp_amount': cp_amount,
                  'cp_drawer_amount': cp_drawer_amount,
                  'cp_number': cp_number,
                  'cp_drawer_id': cp_drawer_id,
                  'cp_drawer_number': cp_drawer_number,
                  'cp_cancelable': cp_cancelable}

            products.append(dict(cp))

        elif 'PLU' in product:
            line_num = 0

            for line in product.strip().split('\n'):
                if 'PLU' in line:
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
                    product_discount = discount_and_total_line[0].replace('Discount: ', '').strip()
                    product_total = discount_and_total_line[1].strip()
                elif line_num == 1:
                    product_name = line.strip()

                line_num += 1

            local_product = {'product_plu': product_plu,
                             'product_canceled': product_canceled,
                             'product_name': product_name,
                             'product_amount': product_amount,
                             'product_price': product_price,
                             'product_discount': product_discount,
                             'product_total': product_total}

            products.append(dict(local_product))
        else:
            print(product + 'XXXXXXXXXXX\n')

    return products


local_data = parse_file('journal_parser/journal_2017-09-01_19-30.txt')
pp = pprint.PrettyPrinter(indent=4, width=100)
# pp.pprint(local_data)
