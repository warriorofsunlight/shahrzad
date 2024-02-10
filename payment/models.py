from django.db import models
from users.models import User
from books.models import Book
# Create your models here.

class Offer(models.Model):
    token = models.CharField(max_length=50)
    percent = models.FloatField(default=1)

    def __str__(self):
        return f'{self.token} --- {self.percent} %'

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.ManyToManyField(Book)
    total = models.BigIntegerField(default=0)
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, null=True, blank=True)
    payable = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f'{self.user.username} --- {self.payable} IT'

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.ManyToManyField(Book)
    payable = models.FloatField()
    is_payed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)