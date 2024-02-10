from django.db import models
from django.contrib.auth.models import (AbstractBaseUser, 
                                        BaseUserManager, 
                                        PermissionsMixin)
# from books.models import Book
# Create your models here.

class UserManager(BaseUserManager):

    def create_user(self, phone_number, username, password=None, **extra_fields):

        if not phone_number:
            raise ValueError('The Phone Number field must be set')
        if not username:
            raise ValueError('The Username field must be set')
        
        user = self.model(
            phone_number=phone_number,
            username=username,
            **extra_fields
        )
        if password:
            user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, phone_number, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(
            phone_number,
            username,
            password,
            **extra_fields
        )

class User(AbstractBaseUser, PermissionsMixin):

    phone_number = models.CharField(unique=True, max_length=11)
    username = models.CharField(max_length=30, unique=True)
    created_time = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(default=False)
    books = models.ManyToManyField('books.Book', blank=True)

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['username']
    objects = UserManager()

    def __str__(self):
        return self.username