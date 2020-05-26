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
    files_in_0001.sort()
    files_in_0002.sort()

    print('0001:')
    with tqdm(files_in_0001) as pbar:
        for filename in pbar:
            pbar.set_postfix_str(s=filename[-27:], refresh=True)
            time.sleep(0.1)
            process(filename)

    print('0002:')
    with tqdm(files_in_0002) as pbar:
        for filename in pbar:
            pbar.set_postfix_str(s=filename[-27:], refresh=True)
            time.sleep(0.1)
            process(filename)
