# Generated by Django 5.1.4 on 2025-01-07 12:18

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("expensetracker", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="category",
            options={"ordering": ["-name"], "verbose_name_plural": "Categories"},
        ),
        migrations.AlterModelOptions(
            name="expense",
            options={"ordering": ["-category"]},
        ),
        migrations.RemoveField(
            model_name="expense",
            name="data",
        ),
        migrations.AddField(
            model_name="expense",
            name="date",
            field=models.DateField(
                default=datetime.datetime(
                    2025, 1, 7, 12, 18, 13, 876134, tzinfo=datetime.timezone.utc
                )
            ),
        ),
    ]
