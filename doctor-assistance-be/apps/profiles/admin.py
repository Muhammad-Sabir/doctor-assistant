from django.contrib import admin

from apps.profiles.models import (
    Speciality, 
    Degree, 
    Disease, 
    DoctorProfile,
    PatientProfile,
    Allergy
)


admin.site.register(Speciality)
admin.site.register(Degree)
admin.site.register(Disease)
admin.site.register(DoctorProfile)
admin.site.register(PatientProfile)
admin.site.register(Allergy)
