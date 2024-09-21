from django.db import models


class Hospital(models.Model):
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    street_address = models.CharField(max_length=255, blank=True)
    logo_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name
