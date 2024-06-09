# Generated by Django 4.2.13 on 2024-06-08 10:10

from django.db import migrations, models
import user_management.models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0004_delete_globalachievements'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to=[user_management.models.user_avatar_upload_path]),
        ),
    ]
