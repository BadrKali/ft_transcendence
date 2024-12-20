# Generated by Django 4.2.13 on 2024-09-24 10:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0010_localplayer_remove_localtournamentuser_keys_and_more'),
        ('game', '0004_localgameroom_arena_localplayer_keys_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='localgameroom',
            name='player1',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='local_game_room_player1', to='user_management.localplayer'),
        ),
        migrations.AlterField(
            model_name='localgameroom',
            name='player2',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='local_game_room_player2', to='user_management.localplayer'),
        ),
        migrations.DeleteModel(
            name='LocalPlayer',
        ),
    ]
