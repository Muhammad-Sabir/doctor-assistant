# Generated by Django 5.0.6 on 2024-11-07 20:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consultations', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transcription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('transcription_text', models.TextField()),
                ('consultation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transcription', to='consultations.consultation')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]