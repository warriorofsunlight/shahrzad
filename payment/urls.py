from django.urls import path
from .views import *


urlpatterns = [
    path('', cart, name='cart-view'),
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/<int:book_id>/', CartView.as_view(), name='add-cart'),
    path('cart/offer/<str:offer_token>/', Offeradd.as_view(), name='offer'),
    path('cart/checkout/', Checkout.as_view(), name='check out'),
    path('trasanction/', TrasacrionListView.as_view(), name='trasanction-list'),
    path('transaction/<int:tr_id>/', TrasacrionView.as_view(), name='transaction'),
]