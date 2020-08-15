# Generated by Django 3.0.8 on 2020-08-02 00:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('githubNetwork', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='repo',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='repos', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('repo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='commentsRepos', to='githubNetwork.Repo')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='commentsUser', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]