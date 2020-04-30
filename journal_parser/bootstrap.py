import sys
import pprint
import os
import time

from watchdog.observers import Observer
from watchdog.events import RegexMatchingEventHandler
from zipfile import ZipFile

from journal_parser.parser import parse_file


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