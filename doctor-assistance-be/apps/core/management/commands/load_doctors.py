import os

import pandas as pd
from django.core.management.base import BaseCommand
from django.conf import settings

from apps.facilities.models import Hospital
from apps.profiles.models import Speciality, Disease, Degree, DoctorProfile
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Load Doctors, Speciality, Disease and Degree csv data into Postgres database'

    def handle(self, *args, **kwargs):
        file_path = os.path.join(settings.BASE_DIR, 'data', 'doctors.xlsx')
        data = pd.read_excel(file_path)

        speciality_objects = self.get_specialities()

        disease_objects = self.create_diseases(data)
        self.stdout.write(self.style.SUCCESS('Inserted Disease data'))

        degree_objects = self.create_degrees(data)
        self.stdout.write(self.style.SUCCESS('Inserted Degree data'))

        hospital_objects = self.get_hospitals()
        self.stdout.write(self.style.SUCCESS('Loaded Hospital data'))

        self.create_doctors(data, speciality_objects, disease_objects, degree_objects, hospital_objects)
        self.stdout.write(self.style.SUCCESS('Successfully populated the database with doctors and related models'))

    def get_specialities(self):
        return {speciality.name: speciality for speciality in Speciality.objects.all()}

    def create_diseases(self, data):
        for disease_name in data['diseases'].dropna().str.split(',').explode().unique():
            if disease_name:
                Disease.objects.get_or_create(name=disease_name.strip())
        return {disease.name: disease for disease in Disease.objects.all()}

    def create_degrees(self, data):
        for degree_name in data['degrees'].dropna().str.split(',').explode().unique():
            if degree_name:
                Degree.objects.get_or_create(name=degree_name.strip())
        return {degree.name: degree for degree in Degree.objects.all()}

    def get_hospitals(self):
        return {hospital.name: hospital for hospital in Hospital.objects.all()}

    def create_doctors(self, data, speciality_objects, disease_objects, degree_objects, hospital_objects):
        for _, row in data.iterrows():
            pmdc_no = str(row['pmdc_no']).strip()
            defaults = {
                'name': row['name'].strip(),
                'date_of_experience': row['date_of_experience'],
                'gender': row['gender'].strip(),
                'file_url': (row['image_url'].strip() if isinstance(row['image_url'], str) else '') or 'https://static.marham.pk/assets/images/doctor-photo-male-170170.webp',
            }

            doctor_profile, created = DoctorProfile.objects.get_or_create(pmdc_no=pmdc_no, defaults=defaults)

            if created:
                for field, objects in {
                    'specialities': speciality_objects,
                    'diseases': disease_objects,
                    'degrees': degree_objects,
                    'hospitals': hospital_objects,
                }.items():
                    if isinstance(row[field], str):
                        items = [
                            objects[item.strip()]
                            for item in row[field].split(',')
                            if item.strip() in objects
                        ]
                                    
                        getattr(doctor_profile, field).set(items)

                doctor_profile.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully created doctor profile: {doctor_profile.name}'))
