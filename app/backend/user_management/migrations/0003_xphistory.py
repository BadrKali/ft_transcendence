# Generated by Django 4.2.13 on 2024-08-31 08:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0002_alter_player_rank'),
    ]

    operations = [
        migrations.CreateModel(
            name='XPHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('xp', models.IntegerField()),
                ('date', models.DateField(auto_now_add=True)),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='xp_history', to='user_management.player')),
            ],
        ),
    ]
