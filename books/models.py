from django.db import models
from users.models import User
# from django.apps import apps
# Create your models here.

class Category(models.Model):
    title = models.CharField(max_length=100)
    img = models.ImageField(upload_to='categories_images/', default='cat.svg')

    def __str__(self) -> str:
        return f'{self.title}'


class Book(models.Model):
    title = models.CharField(max_length=100)
    authour =  models.CharField(max_length=100)
    description = models.TextField()
    summary = models.TextField()
    Audio = models.FileField(upload_to='books_audios/', default='music.svg')
    created = models.DateTimeField(auto_now_add=True)
    duration = models.PositiveSmallIntegerField()
    img = models.ImageField(upload_to='books_images/', default='book.svg')
    price = models.PositiveSmallIntegerField()
    rate = models.FloatField(null=True, blank=True)
    category = models.ManyToManyField(Category)

    def __str__(self) -> str:
        return f'{self.title} By {self.authour} In {self.category}'


class Comment(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rate = models.PositiveSmallIntegerField(default=5)
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f'{self.user.username} For {self.book.title}'