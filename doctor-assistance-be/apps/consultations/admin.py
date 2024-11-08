from django.contrib import admin

from apps.consultations.models import Consultation, SOAPNotes, Prescription, Transcription


admin.site.register(Consultation)
admin.site.register(SOAPNotes)
admin.site.register(Transcription)
admin.site.register(Prescription)
