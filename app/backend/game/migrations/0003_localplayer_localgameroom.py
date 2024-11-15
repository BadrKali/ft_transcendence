# Generated by Django 4.2.13 on 2024-09-23 21:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_gameroom_player1_disconnected_at_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='LocalPlayer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=100)),
                ('avatar', models.ImageField(null=True, upload_to='')),
            ],
        ),
        migrations.CreateModel(
            name='LocalGameRoom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('crateated_at', models.DateTimeField(auto_now_add=True)),
                ('player1', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='local_game_room_player1', to='game.localplayer')),
                ('player2', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='local_game_room_player2', to='game.localplayer')),
            ],
        ),
    ]
