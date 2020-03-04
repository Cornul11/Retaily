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
            journal_record_no = None
            journal_record_date = None
            journal_record_cashier = None
            journal_record_type = None
            if 'Aborted Sale' in journal_record:
                temp_splitted = journal_record.split('---\n')
                # Parsing the intro part containing the basic data about the record
                for line in temp_splitted[0].split('\n'):
                    if 'Journal Record' in line:
                        splitted_line = line.rsplit('/', 1)
                        journal_record_no = splitted_line[0].strip().replace('Journal Record: ', '')
                        journal_record_date = splitted_line[1].strip()
                    if 'Cashier' in line:
                        journal_record_cashier = line.split(':')[1].strip()
                    if 'Record Type' in line:
                        journal_record_type = line.split(':')[1].strip()

                products = []
                product_plu = None
                product_name = None
                product_amount = None
                product_price = None
                product_discount = None
                product_total = None
                product_canceled = False
                # Parsing the purchased products
                for product in temp_splitted[2].strip().split('*')[1:]:
                    if 'PaymentRoundingCompensation' in product:
                        continue  # TODO: specify what is this
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
                local_record = {'journal_record_no': journal_record_no,
                                'journal_record_date': journal_record_date,
                                'journal_record_cashier': journal_record_cashier,
                                'journal_record_type': journal_record_type,
                                'journal_record_products': products}
                records.append(dict(local_record))
            else:
                temp_splitted = journal_record.split('---\n---')
                for line in temp_splitted[0].split('\n'):
                    if 'Journal Record' in line:
                        splitted_line = line.rsplit('/', 1)
                        journal_record_no = splitted_line[0].strip().replace('Journal Record: ', '')
                        journal_record_date = splitted_line[1].strip()
                    if 'Cashier' in line:
                        journal_record_cashier = line.split(':')[1].strip()
                    if 'Record Type' in line:
                        journal_record_type = line.split(':')[1].strip()
                products = []
                product_plu = None
                product_name = None
                product_amount = None
                product_price = None
                product_discount = None
                product_total = None
                product_canceled = False
                # Parsing the purchased products
                for product in temp_splitted[1].strip().split('*')[1:]:
                    if 'PaymentRoundingCompensation' in product:
                        continue  # TODO: specify what is this
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
                local_record = {'journal_record_no': journal_record_no,
                                'journal_record_date': journal_record_date,
                                'journal_record_cashier': journal_record_cashier,
                                'journal_record_type': journal_record_type,
                                'journal_record_products': products}
                records.append(dict(local_record))
    return records


local_data = parse_file('testing.txt')
pp = pprint.PrettyPrinter(indent=4)
pp.pprint(local_data)
