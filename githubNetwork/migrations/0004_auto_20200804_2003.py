# Generated by Django 3.0.8 on 2020-08-04 23:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('githubNetwork', '0003_auto_20200804_2002'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='comment',
            field=models.CharField(max_length=1250),
        ),
    ]
