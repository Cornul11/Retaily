import re
import pandas as pd


def parse_file(filepath):
    """

    :param filepath:
    :return:
    """

    journal_records = []
    with open(filepath, 'r') as file_object:
        file_contents = file_object.read().strip()
        journal_records = file_contents.split('===')[1:-1]
    return journal_records


local_data = parse_file('testing.txt')
print(len(local_data))
for text in local_data:
    print(text)
    print('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n')
print(local_data)
