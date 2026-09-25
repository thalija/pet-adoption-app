"""
Create the `users` and `pets` tables in the local SQLite database and load the
sample data from database/DatingAppDDL.sql.

The Users/Pets models are unmanaged (managed = False) because in production the
tables already exist, so `migrate` never creates them. This command creates them
for local development only.

Usage (from backend/):
    python manage.py init_local_db          # create tables + sample data
    python manage.py init_local_db --reset  # drop and recreate them
"""

import re
from pathlib import Path

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError
from django.db import connection, transaction

from dbmodels.models import Pets, Users

DDL_FILE = Path(settings.BASE_DIR).parent / "database" / "DatingAppDDL.sql"


def split_sql_statements(sql):
    """Split SQL text on semicolons that are not inside quoted strings, dropping -- comments."""
    statements, current = [], []
    in_quote = False
    i = 0
    while i < len(sql):
        ch = sql[i]
        if in_quote:
            current.append(ch)
            if ch == "'":
                # '' is an escaped quote inside a string
                if i + 1 < len(sql) and sql[i + 1] == "'":
                    current.append("'")
                    i += 1
                else:
                    in_quote = False
        elif ch == "'":
            in_quote = True
            current.append(ch)
        elif sql.startswith("--", i):
            # Skip comment until end of line
            end = sql.find("\n", i)
            i = len(sql) if end == -1 else end
            continue
        elif ch == ";":
            statements.append("".join(current).strip())
            current = []
        else:
            current.append(ch)
        i += 1
    if "".join(current).strip():
        statements.append("".join(current).strip())
    return statements


class Command(BaseCommand):
    help = "Create the users/pets tables in the local SQLite database and load the sample data."

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="Drop and recreate the users/pets tables.")

    def handle(self, *args, reset=False, **options):
        if connection.vendor != "sqlite":
            raise CommandError("init_local_db only works with the local SQLite database (unset DATABASE_URL).")

        # Django's own tables (auth, admin, sessions, accounts.Profile)
        call_command("migrate", verbosity=0)

        existing = connection.introspection.table_names()
        if Users._meta.db_table in existing and not reset:
            self.stdout.write("Tables already exist. Use --reset to recreate them.")
            return

        inserts = [
            s for s in split_sql_statements(DDL_FILE.read_text(encoding="utf-8"))
            if re.match(r"INSERT\s+INTO\s+(users|pets)\b", s, re.IGNORECASE)
        ]

        # The schema editor runs in its own transaction
        with connection.schema_editor() as editor:
            # Drop pets first because it references users
            for model in (Pets, Users):
                if model._meta.db_table in existing:
                    editor.delete_model(model)
            for model in (Users, Pets):
                editor.create_model(model)

        with transaction.atomic():
            with connection.cursor() as cursor:
                for statement in inserts:
                    cursor.execute(statement)

            # The sample data has plain-text passwords; store them hashed so login works
            for user in Users.objects.all():
                if not user.password.startswith("pbkdf2_"):
                    user.password = make_password(user.password)
                    user.save(update_fields=["password"])

        self.stdout.write(self.style.SUCCESS(
            f"Created tables with {Users.objects.count()} users and {Pets.objects.count()} pets."
        ))
