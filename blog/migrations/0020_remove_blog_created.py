# Generated by Django 3.1.1 on 2020-09-21 14:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0019_auto_20200921_2106'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blog',
            name='created',
        ),
    ]
