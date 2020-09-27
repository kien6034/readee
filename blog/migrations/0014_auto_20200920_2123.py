# Generated by Django 3.1.1 on 2020-09-20 14:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0013_blogcluster'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='created',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='blog',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='blog',
            name='public_state',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='blog',
            name='views',
            field=models.IntegerField(default=0),
        ),
    ]