from django.contrib import admin

from apps.consultations.models import Consultation, SOAPNotes, Perscription


admin.site.register(Consultation)
admin.site.register(SOAPNotes)
admin.site.register(Perscription)
