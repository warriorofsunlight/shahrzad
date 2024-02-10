from rest_framework import serializers
from .models import *
from books.serializer import *

class UserSerializer(serializers.ModelSerializer):

    books = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'

    def get_books(self, obj):
        return [book.title for book in obj.book.all()]