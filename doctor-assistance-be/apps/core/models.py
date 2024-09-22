from django.db import models
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class BaseFileUpload(TimeStampedModel):
    file_url = models.URLField(blank=True, null=True)

    class Meta:
        abstract = True

    def save_file(self, file):
        if not file:
            raise ValidationError("No file provided")

        try:
            file_name = default_storage.save(file.name, ContentFile(file.read()))
            self.file_url = default_storage.url(file_name)
        except Exception as e:
            raise ValidationError(f"File upload failed: {e}")
