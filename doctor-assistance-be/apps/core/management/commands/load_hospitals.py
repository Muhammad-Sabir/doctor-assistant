import os

import pandas as pd
from django.core.management.base import BaseCommand
from django.conf import settings

from apps.facilities.models import Hospital


class Command(BaseCommand):
    help = 'Load Hospitals csv data into Postgres database'

    def handle(self, *args, **kwargs):
        file_path = os.path.join(settings.BASE_DIR, 'data', 'hospitals.csv')
        data = pd.read_csv(file_path)

        self.create_hospitals(data)
        self.stdout.write(self.style.SUCCESS('Successfully populated the database with hospitals'))

    def create_hospitals(self, data):
        for _, row in data.iterrows():
            Hospital.objects.get_or_create(
                name=row['name'],
                street_address=row['street_address'],
                defaults={
                    'city': row['city'],
                    'logo_url': row['logo_url'],
                }
            )
