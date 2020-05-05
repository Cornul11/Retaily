import logging
import os
import sys
import time
from zipfile import ZipFile

from watchdog.events import RegexMatchingEventHandler
from watchdog.observers import Observer

from journal_parser.parser import parse_file

logging.basicConfig(filename='main.log', level=logging.INFO, format='%(asctime)s %(levelname)s:%(message)s')
logger = logging.getLogger(__name__)


def process(event):
    with ZipFile(event.src_path, 'r') as zip_file:
        logger.info('Extracting \'%s\'', event.src_path)
        zip_file.extractall('temp')

    for filename in os.listdir('temp'):
        if filename.endswith('.txt'):
            logger.info('Parsing \'temp/%s\'', filename)
            parse_file('temp/' + filename)
            logger.info('Successfully parsed \'temp/%s\'', filename)
            os.remove(filename)


class ArchiveEventHandler(RegexMatchingEventHandler):
    """
    Whenever an event happens, this class handles it properly,
    based on the triggering event.
    """

    ARCHIVE_REGEX = [r'.*\.zip$']

    def __init__(self):
        super().__init__(self.ARCHIVE_REGEX)

    def on_created(self, event):
        logger.info('New file, processing \'%s\'', event.src_path)
        process(event)

    """
    Whenever a new .zip file appears, it extracts it in the temp folder, which
    extracts in fact multiple new .zip files, after which it extracts these .zip files
    containing the .txt files which are in fact the journal records.
    """


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
    src_path = sys.argv[1] if len(sys.argv) > 1 else '.'
    logger.info('Started watching for changes in \'%s\'', src_path)
    ArchiveWatcher(src_path).run()
