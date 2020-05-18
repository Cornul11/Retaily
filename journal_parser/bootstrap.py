import os
import sys
import time
from zipfile import ZipFile
from tqdm import tqdm

from journal_parser.parser import parse_file


def process(src_path):
    with ZipFile(src_path, 'r') as zip_file:
        zip_file.extractall('temp')

    for filename in os.listdir('temp'):
        if filename.endswith('.txt'):
            parse_file('temp/' + filename)
            os.remove('temp/' + filename)


if __name__ == '__main__':
    src_path = sys.argv[1] if len(sys.argv) > 1 else '.'
    print('Journal parser for uploading started at: ', time.ctime())
    print('Uploading everything in ', src_path)
    files_in_0001 = [src_path + '/0001/' + file for file in os.listdir(src_path + '/0001')]
    files_in_0002 = [src_path + '/0002/' + file for file in os.listdir(src_path + '/0002')]

    print('0001:')
    for filename in tqdm(files_in_0001):
        process(filename)

    print('0002:')
    for filename in tqdm(files_in_0002):
        process(filename)
