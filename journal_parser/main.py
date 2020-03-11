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
            if aborted_sale:
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
            prc_amount = None
            prc_payment_no = None
            prc_cancelable = None
            for line in product.strip().split('\n'):
                if 'Amount' in line:  # TODO: specify what is this
                    prc_amount = line.split(':')[1].strip()
                elif 'PaymentNumber' in line:
                    prc_payment_no = line.split(':')[1].strip()
                elif 'IsCancelable' in line:
                    prc_cancelable = line.split(':')[1].strip()
            prc = {'prc_amount': prc_amount,
                   'prc_payment_no': prc_payment_no,
                   'prc_cancelable': prc_cancelable}
            products.append(dict(prc))
        elif 'MixAndMatchDiscountItem' in product:
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
        elif 'CashPayment' in product:
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
                    print('WE HERE')
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
        else:
            line_num = 0

            for line in product.strip().split('\n'):
                if 'PLU' in line:
                    if 'CANCELED' in line:
                        print('LINE contains CANCELED: ' + line)
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
    return products


local_data = parse_file('testing.txt')
pp = pprint.PrettyPrinter(indent=4, width=100)
pp.pprint(local_data)
