from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'patient'

class isDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        
        return request.user.role == 'doctor'


class IsDoctorOrOwner(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        
        return request.user.is_authenticated and request.user.role == 'doctor'

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        
        return obj.user == request.user and request.user.role == 'doctor'


class IsPatientOrOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        
        if obj.user == request.user and hasattr(request.user, 'role') and request.user.role == 'patient':
            return True
        
        if (
            hasattr(obj, 'primary_patient') and
            obj.primary_patient and
            obj.primary_patient.user == request.user and
            request.user.role == 'patient'
        ):
            return True
        
        return False
