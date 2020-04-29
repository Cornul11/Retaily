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

            products = []
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


class ArchiveEventHandler(RegexMatchingEventHandler):
    """
    Whenever an event happens, this class handles it properly,
    based on the triggering event.
    """

    ARCHIVE_REGEX = [r".*\.zip$"]

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
                print(
                    "parsed %d receipts" % (len(local_data))
                )

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




if __name__ == "__main__":
    src_path = sys.argv[1] if len(sys.argv) > 1 else '.'
    ArchiveWatcher(src_path).run()


"""
start_time = time.time()
local_data = parse_file("journal_parser/journal_2017-09-01_19-30.txt")

# debug info
print(
    "parsed %d receipts in %s seconds" % (len(local_data), (time.time() - start_time))
)

pp = pprint.PrettyPrinter(indent=4, width=100)
pp.pprint(local_data)
"""
