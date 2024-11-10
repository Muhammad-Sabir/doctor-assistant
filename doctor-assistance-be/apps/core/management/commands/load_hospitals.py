import os
from decimal import Decimal, InvalidOperation, ROUND_DOWN

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
            latitude = self.convert_to_decimal(row['latitude'], min_value=-90, max_value=90)
            longitude = self.convert_to_decimal(row['longitude'], min_value=-180, max_value=180)

            print(latitude, latitude)
            Hospital.objects.get_or_create(
                name=row['name'],
                street_address=row['street_address'],
                defaults={
                    'city': row['city'],
                    'logo_url': row['logo_url'],
                    'latitude': latitude,
                    'longitude': longitude,
                }
            )
    
    def convert_to_decimal(self, value, min_value=None, max_value=None):
        if pd.notna(value):
            try:
                # Convert to Decimal and round to 6 decimal places
                decimal_value = Decimal(value).quantize(Decimal('0.000001'), rounding=ROUND_DOWN)
                # Check if within the specified range
                if min_value is not None and decimal_value < min_value:
                    return None
                if max_value is not None and decimal_value > max_value:
                    return None
                return decimal_value
            except InvalidOperation:
                return None
        return None
