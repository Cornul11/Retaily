import sys
import pprint
import os
import time

from watchdog.observers import Observer
from watchdog.events import RegexMatchingEventHandler
from zipfile import ZipFile

from journal_parser.parser import parse_journal_data, parse_components


def parse_file(filepath: str) -> object:
    records = []

    # these journal records can be ignored as they contain no valuable information for our scope
    record_ignore_words = ['JournalRecordNumberReset', 'NoSale', 'DataClear']

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
                splitter_string = '---\n'
                aborted_sale = True
            else:
                splitter_string = '---\n---'
                aborted_sale = False

            temp_split = journal_record.split(splitter_string)

            # Parsing the intro part containing the basic data about the record
            record_no, record_date, record_cashier, record_type = parse_journal_data(
                temp_split[0]
            )

            record_ignore_words = ['Cancellation', 'Customer', 'InOutPayment', 'ReportRecord',
                                   'JournalRecordNumberReset', 'NoSale', 'DataClear']

            # Parsing the purchased products
            if any(elem in journal_record for elem in record_ignore_words):
                continue
            elif 'NeutralList' in journal_record:
                neutral_list_split = temp_split[0].split('---\n')
                products = parse_components(neutral_list_split[2], filepath)
            elif aborted_sale:
                products = parse_components(temp_split[2], filepath)
            else:
                products = parse_components(temp_split[1], filepath)

            local_record = {
                'journal_record_no': record_no,
                'journal_record_date': record_date,
                'journal_record_cashier': record_cashier,
                'journal_record_type': record_type,
                'journal_record_aborted': aborted_sale,
                'journal_record_products': products,
            }

            records.append(dict(local_record))

    return records


class ArchiveEventHandler(RegexMatchingEventHandler):
    """
    Whenever an event happens, this class handles it properly,
    based on the triggering event.
    """

    ARCHIVE_REGEX = [r'.*\.zip$']

    def __init__(self):
        super().__init__(self.ARCHIVE_REGEX)

    def on_created(self, event):
        self.process(event)

    """
    Whenever a new .zip file appears, it extracts it in the temp folder, which
    extracts in fact multiple new .zip files, after which it extracts these .zip files
    containing the .txt files which are in fact the journal records.
    """

    def process(self, event):
        with ZipFile(event.src_path, 'r') as zip_file:
            zip_file.extractall('temp')

        for filename in os.listdir('temp'):
            if filename.endswith('.txt'):
                print('parsing ' + filename)
                local_data = parse_file('temp/' + filename)

                # debug info
                print('parsed %d receipts' % (len(local_data)))

                pp = pprint.PrettyPrinter(indent=4, width=100)
                pp.pprint(local_data)


class ArchiveWatcher:
    """
    Runs the watcher that checks for new zip files in the given path.
    """

    def __init__(self, src_path: str):
        self.__src_path = src_path
        self.__event_handler = ArchiveEventHandler()
        self.__event_observer = Observer()

    def run(self):
        self.start()
        try:
            # check every second for a file update
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stop()

    def start(self):
        self.__schedule()
        self.__event_observer.start()

    def stop(self):
        self.__event_observer.stop()
        self.__event_observer.join()

    def __schedule(self):
        self.__event_observer.schedule(self.__event_handler,
                                       self.__src_path,
                                       recursive=True)


if __name__ == '__main__':
    pass
    # src_path = sys.argv[1] if len(sys.argv) > 1 else '.'
    # ArchiveWatcher(src_path).run()

# start_time = time.time()
for filename in os.listdir('temp/0002'):
    if filename.endswith('.txt'):
        local_data = parse_file('temp/0002/' + filename)

# local_data = parse_file("testing.txt")
pp = pprint.PrettyPrinter(indent=4, width=100)
pp.pprint(local_data)
"""
# debug info
print(
    "parsed %d receipts in %s seconds" % (len(local_data), (time.time() - start_time))
)

pp = pprint.PrettyPrinter(indent=4, width=100)
pp.pprint(local_data)
"""
