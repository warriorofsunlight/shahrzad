from rest_framework import serializers
from .models import *

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):

    items = serializers.SerializerMethodField()
    offer = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = '__all__'


    def get_items(self, obj):
        return [{"id":item.id,
                    "title":item.title,
                        "price":item.price,
                            "author":item.authour,
                                "img":item.img.url} for item in obj.items.all()]
    
    def get_offer(self, obj):
        return obj.offer.percent

class TransactionSerializer(serializers.ModelSerializer):

    items = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = '__all__'

    def get_items(self, obj):
        return [item.title for item in obj.items.all()]