from django.contrib import admin

from apps.profiles.models import Speciality, Degree, Disease, DoctorProfile


admin.site.register(Speciality)
admin.site.register(Degree)
admin.site.register(Disease)
admin.site.register(DoctorProfile)
