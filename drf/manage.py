#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main(app_port):
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "apistarter.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    command = sys.argv
    if command[1] == "runserver":
        execute_from_command_line(["manage.py", "runserver", f"0.0.0.0:{app_port}"])
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main(os.getenv("APP_PORT", "8000"))
