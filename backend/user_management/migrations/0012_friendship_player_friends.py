# Generated by Django 4.2.13 on 2024-06-09 08:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0011_alter_player_avatar'),
    ]

    operations = [
        migrations.CreateModel(
            name='Friendship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('blocked', models.BooleanField(default=False)),
                ('friend', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friends_with', to='user_management.player')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friendships', to='user_management.player')),
            ],
            options={
                'unique_together': {('player', 'friend')},
            },
        ),
        migrations.AddField(
            model_name='player',
            name='friends',
            field=models.ManyToManyField(through='user_management.Friendship', to='user_management.player'),
        ),
    ]
