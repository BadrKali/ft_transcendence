# Generated by Django 4.2.13 on 2024-08-15 10:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0033_tournamentparticipants_matchplayed_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tournamentparticipants',
            name='matchStage',
            field=models.CharField(default='SEMI-FINALS', max_length=100),
        ),
    ]
