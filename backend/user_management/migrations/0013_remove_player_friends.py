# Generated by Django 4.2.13 on 2024-06-09 10:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0012_friendship_player_friends'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='player',
            name='friends',
        ),
    ]
