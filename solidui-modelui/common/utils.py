import threading
from concurrent.futures import ThreadPoolExecutor

def thread_factory(thread_name: str, is_daemon: bool):
    thread_id = 0

    def create_thread(func):
        nonlocal thread_id
        thread_id += 1
        thread_name = f'{thread_name}{thread_id}'
        thread = threading.Thread(target=func, name=thread_name)
        thread.setDaemon(is_daemon)
        return thread

    return create_thread

def default_scheduler():
    executor = ThreadPoolExecutor(
        max_workers=20,
        thread_name_prefix='SolidUI-Default-Scheduler-Thread-',
        thread_factory=thread_factory
    )
    executor.set_keep_alive(5, 60)
    return executor