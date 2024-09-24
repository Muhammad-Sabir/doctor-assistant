import os

import pandas as pd
from django.core.management.base import BaseCommand
from django.conf import settings

from apps.profiles.models import Speciality


class Command(BaseCommand):
    help = 'Load Specialities csv data into Postgres database'

    def handle(self, *args, **kwargs):
        file_path = os.path.join(settings.BASE_DIR, 'data', 'specialities.csv')
        data = pd.read_csv(file_path)

        self.create_specialities(data)
        self.stdout.write(self.style.SUCCESS('Successfully populated the database with specialities'))

    def create_specialities(self, data):
        for _, row in data.iterrows():
            Speciality.objects.get_or_create(
                name=row['name'],
            )
