# Generated by Django 3.1.1 on 2020-09-21 14:06

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0018_auto_20200921_2055'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='created',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
