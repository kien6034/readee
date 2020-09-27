# Generated by Django 3.1.1 on 2020-09-17 15:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
        ('blog', '0012_delete_blogcluster'),
    ]

    operations = [
        migrations.CreateModel(
            name='BlogCluster',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('public_state', models.BooleanField(default=True)),
                ('blogs', models.ManyToManyField(blank=True, related_name='cluster', to='blog.Blog')),
                ('member', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='my_group', to='base.member')),
            ],
        ),
    ]