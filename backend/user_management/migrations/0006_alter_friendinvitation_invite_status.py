# Generated by Django 4.2.13 on 2024-06-08 10:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0005_notifications_friendinvitation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friendinvitation',
            name='invite_status',
            field=models.CharField(choices=[('A', 'ACCEPTED'), ('P', 'PENDING'), ('D', 'DECLINED')], default='P', max_length=1),
        ),
    ]
