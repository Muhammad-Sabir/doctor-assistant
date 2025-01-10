from django.contrib import admin

from apps.appointments.models import Appointment, DoctorDateOverride, DoctorSchedule


admin.site.register(Appointment)
admin.site.register(DoctorDateOverride)
admin.site.register(DoctorSchedule)
