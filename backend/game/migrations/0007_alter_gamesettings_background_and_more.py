# Generated by Django 4.2.13 on 2024-10-01 21:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0006_alter_gamesettings_background_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gamesettings',
            name='background',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='gamesettings',
            name='gameMode',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='gamesettings',
            name='keys',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='gamesettings',
            name='paddle',
            field=models.CharField(max_length=255),
        ),
    ]
