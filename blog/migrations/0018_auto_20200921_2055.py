# Generated by Django 3.1.1 on 2020-09-21 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0017_blogcluster_totalviews'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='created',
            field=models.DateField(auto_now_add=True, null=True),
        ),
    ]
