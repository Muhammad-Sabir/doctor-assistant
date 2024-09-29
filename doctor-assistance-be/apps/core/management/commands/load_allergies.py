import os

import pandas as pd
from django.core.management.base import BaseCommand
from django.conf import settings

from apps.profiles.models import Allergy


class Command(BaseCommand):
    help = 'Load Allergies csv data into Postgres database'

    def handle(self, *args, **kwargs):
        file_path = os.path.join(settings.BASE_DIR, 'data', 'allergies.csv')
        data = pd.read_csv(file_path)

        unique_allergies = data['Allergy'].unique()
        self.create_allergies(unique_allergies)
        self.stdout.write(self.style.SUCCESS('Successfully populated the database with allergies'))

    def create_allergies(self, unique_allergies):
        for allergy in unique_allergies:
            Allergy.objects.get_or_create(
                name=allergy,
            )
