from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.accounts.utils import get_user_from_uid, check_token
from apps.accounts.models import UserRole, OTP

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'phone_number', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}


class RoleBasedTokenObtainPairSerializer(TokenObtainPairSerializer):
    role = serializers.ChoiceField(choices=UserRole.choices, required=True)

    def validate(self, attrs):
        role = attrs.pop('role', None)

        data = super().validate(attrs)

        user = self.user

        if role and user.role != role:
            raise serializers.ValidationError('User role does not match.')

        data.update({
            'role': user.role,
            'is_profile_completed': user.is_profile_completed
        })

        return data


class BasePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['password']

    def save(self, **kwargs):
        user = self.context.get('user', self.instance)
        user.set_password(self.validated_data['password'])
        user.save(update_fields=['password'])
        return user

    def to_representation(self, instance):
        return {'detail': 'Password successfully changed'}


class UserPasswordUpdationSerializer(BasePasswordSerializer):
    new_password = serializers.CharField(max_length=128,
                                        write_only=True)

    class Meta(BasePasswordSerializer.Meta):
        model = User
        fields = ['password', 'new_password']


    def validate(self, data):
        user = self.context['request'].user
        if not user.check_password(data['password']):
            raise serializers.ValidationError("Current password is incorrect.")
        if data['password'] == data['new_password']:
            raise serializers.ValidationError('New password should be different from the old password.')
        return data
    
    def save(self, **kwargs):
        self.validated_data['password'] = self.validated_data.pop('new_password')
        return super().save(**kwargs)


class PasswordResetConfirmSerializer(BasePasswordSerializer):
    def validate(self, data):
        uid = self.context.get('uid')
        token = self.context.get('token')
        user = self._get_user(uid)
        
        if not check_token(user, token):
            raise serializers.ValidationError('Invalid or expired token.')

        self.context['user'] = user
        return data
    
    def _get_user(self, uid):
        try:
            return get_user_from_uid(uid)
        except (ValueError, User.DoesNotExist):
            raise serializers.ValidationError('Invalid user.')


class VerifyEmailSerializer(serializers.ModelSerializer):    
    email = serializers.EmailField(max_length=255)

    class Meta:
        model = User
        fields = ['email']
        
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email Not found')
        return value


class VerifyAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = []

    def validate(self, data):
        uid = self.context.get('uid')
        token = self.context.get('token')
        user = self._get_user(uid)
        
        if not check_token(user, token):
            raise serializers.ValidationError('Invalid or expired token.')

        self.context['user'] = user
        return data
    
    def _get_user(self, uid):
        try:
            return get_user_from_uid(uid)
        except (ValueError, User.DoesNotExist):
            raise serializers.ValidationError('Invalid user.')  
    
    def save(self, **kwargs):
        user = self.context['user']
        user.is_account_verified = True
        user.save(update_fields=['is_account_verified'])
        return user


class OTPVerifyAccountSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        otp_code = data.get('otp_code')

        try:
            user = User.objects.get(email=email)
            otp = OTP.objects.filter(user=user).last()
            if (otp and not otp.is_valid()) and otp.otp_code != otp_code:
                raise serializers.ValidationError('Invalid or expired token.')
        except User.DoesNotExist:
            raise serializers.ValidationError('User does not exist')

        self.context['user'] = user
        return data
    
    def save(self, **kwargs):
        user = self.context['user']
        user.is_account_verified = True
        user.save(update_fields=['is_account_verified'])
        return user
