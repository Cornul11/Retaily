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
            continue  # TODO: specify what is this

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
