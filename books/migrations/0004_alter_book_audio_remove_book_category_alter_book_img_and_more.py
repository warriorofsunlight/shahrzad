# Generated by Django 5.0.1 on 2024-02-07 16:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0003_alter_book_summary'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='Audio',
            field=models.FileField(default='music.svg', upload_to='books_audios/'),
        ),
        migrations.RemoveField(
            model_name='book',
            name='category',
        ),
        migrations.AlterField(
            model_name='book',
            name='img',
            field=models.ImageField(default='book.svg', upload_to='books_images/'),
        ),
        migrations.AlterField(
            model_name='category',
            name='img',
            field=models.ImageField(default='cat.svg', upload_to='categories_images/'),
        ),
        migrations.AddField(
            model_name='book',
            name='category',
            field=models.ManyToManyField(to='books.category'),
        ),
    ]
