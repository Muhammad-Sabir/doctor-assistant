import debug_toolbar
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('apps.accounts.urls')),
    path('api/', include('apps.facilities.urls')),
    path('api/', include('apps.profiles.urls')),
    path('api/', include('apps.reviews.urls')),
    path('api/', include('apps.appointments.urls')),
    path('api/', include('apps.consultations.urls')),
    path('__debug__/', include(debug_toolbar.urls))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
