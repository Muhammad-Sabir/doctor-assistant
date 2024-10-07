from django.db.models import Manager, Avg, Count, Value, FloatField
from django.db.models.functions import Coalesce

class DoctorProfileManager(Manager):
    def with_reviews_data(self):
        return self.get_queryset().annotate(
            total_reviews=Count('reviews'),
            average_rating=Coalesce(Avg('reviews__rating'), Value(0.0, output_field=FloatField()))
        )
