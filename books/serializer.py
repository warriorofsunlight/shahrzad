from rest_framework import serializers
from .models import *
        
class PremiumBookSerializer(serializers.ModelSerializer):
    
    category = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = '__all__'

    def get_category(self, obj):
        return [category.title for category in obj.category.all()]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):

    category = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ('id', 'title', 'authour', 'description', 'duration', 'img', 'price', 'rate', 'category')

    def get_category(self, obj):
        return [category.title for category in obj.category.all()]

