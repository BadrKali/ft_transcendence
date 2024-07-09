from .models import User
from rest_framework import serializers
from user_management.models import Player
from django.contrib.auth.password_validation import validate_password

def user_avatar_upload_path(instance, filename):
    return f"player/{instance.id}/user_avatar/{filename}"

class CurrentUserSerializer(serializers.ModelSerializer):
    avatar_type = serializers.CharField(write_only=True, required=False)
    class Meta:
        model = User
        fields = ['id', 'avatar', 'username', 'email', 'avatar_type']

class UserRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    avatar_type = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['avatar', 'username', 'email', 'password', 'confirm_password', 'avatar_type']
        extra_kwargs = {"password": {"write_only": True}}
    
    def validate(self, data):
        if(data['password'] != data['confirm_password']):
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        return data

    def create(self, validated_data):
        confirm_password = validated_data.pop('confirm_password')
        avatar_type = validated_data.pop('avatar_type', None)
        if avatar_type:
            validated_data['avatar'] = f'avatars/{avatar_type}.png'
        user = User.objects.create(**validated_data)
        player = Player.objects.create(user=user)
        user.set_password(validated_data['password'])
        user.save()
        return user
        