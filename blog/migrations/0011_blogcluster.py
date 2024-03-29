# Generated by Django 3.1.1 on 2020-09-17 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0010_auto_20200916_2110'),
    ]

    operations = [
        migrations.CreateModel(
            name='BlogCluster',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('public_state', models.BooleanField(default=True)),
                ('blogs', models.ManyToManyField(blank=True, related_name='cluster', to='blog.Blog')),
            ],
        ),
    ]
