from django.shortcuts import render
import requests

from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import *
from .models import *
# Create your views here.

def cart(request):
    return render(request, 'cart.html')

class CartView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, book_id=None):
        user = request.user
        try:
            cart = Cart.objects.get(user=user)
            if cart.items.count() == 0 :
                cart.offer = Offer.objects.get(pk=1)

            if cart is not None:
                serializer = CartSerializer(cart)
                return Response(serializer.data)
            else:
                return Response({'message':'you\'r cart is empty'})
        except Cart.DoesNotExist:
            return Response({'message':'you\'r cart is empty'})
    
    def post(self, request, book_id):
        user = request.user
        print(user)

        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response({'message':'this book does not even exist'})
        
        # offer = None

        try:
            cart = Cart.objects.get(user=user)
        except:
            cart = None
        
        if cart is not None:
            
            cart.items.add(book)
            cart.total += book.price
            
            cart.payable = cart.total * cart.offer.percent
            cart.save()

        else:
            cart = Cart.objects.create(user=user)
            cart.items.add(book)
            cart.total = book.price
            cart.offer = Offer.objects.get(pk=1)
            cart.payable = cart.total * cart.offer.percent
            cart.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    def delete(self, request, book_id=None):

        
        if not book_id:
            return Response({'message':'you should select atleast one book from you\'r cart'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        user = request.user

        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response({'message':'this book does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            cart = Cart.objects.get(user=user)
        except:
            cart = None

        if cart is None:
            return Response({'message': 'Your cart is empty'}, status=status.HTTP_404_NOT_FOUND)
        else:
                
            cart.items.remove(book)
            cart.total -= book.price
            cart.payable = cart.total * cart.offer.percent
            cart.save()


        serializer = CartSerializer(cart)
        return Response(serializer.data)

class Offeradd(APIView):
    def get(self, request, offer_token):
        
        user = request.user

        try:
            offer = Offer.objects.get(token=offer_token)
            serializer = OfferSerializer(offer)
            return Response(serializer.data)
        except Offer.DoesNotExist:
            return Response({'message':'in valid token'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, offer_token):
        user = request.user

        try:
            offer = Offer.objects.get(token=offer_token)
        except Offer.DoesNotExist:
            return Response({'message':'in valid token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(user=user)
            cart.offer = offer
            cart.payable = cart.total * cart.offer.percent
            cart.save()
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        
        except Cart.DoesNotExist:
            return Response({'message':'you don\'t have cart yet'}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, offer_token=None):
        user=request.user

        try:
            cart = Cart.objects.get(user=user)
            cart.offer = Offer.objects.get(pk=1)
            cart.payable = cart.total * cart.offer.percent
            cart.save()
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        
        except Cart.DoesNotExist:
            return Response({'message':'you don\'t have cart yet'}, status=status.HTTP_400_BAD_REQUEST)

        


class TrasacrionListView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            transactions = Transaction.objects.all()
            serializer = TransactionSerializer(transactions, many=True)

            return Response(serializer.data)
        
        except Transaction.DoesNotExist:
            return Response({'message':'no trasaction found'})
        

class TrasacrionView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request, tr_id):
        try:
            transactions = Transaction.objects.get(pk=tr_id)
            serializer = TransactionSerializer(transactions)

            return Response(serializer.data)
        except:
            return Response({'message':'trasaction not found'})


# class PayedTransactionView(APIView):
#     def post(self, request):
#         user = request.user
#         cart = Cart.objects.filter(user=user)

#         transaction = Transaction.objects.create(user=user, items=cart.items,
#                                                   payable=cart.payable, is_payed=True)
        
#         serializer = TransactionSerializer(transaction)
#         return Response(serializer.data)
        
# class NotPayedTransactionView(APIView):
#     def post(self, request):
#         user = request.user
#         cart = Cart.objects.filter(user=user)

#         transaction = Transaction.objects.create(user=user, items=cart.items,
#                                                   payable=cart.payable, is_payed=False)
        
#         serializer = TransactionSerializer(transaction)
#         return Response(serializer.data)
        
def payedtr(user):
    try:
        cart = Cart.objects.get(user=user)
        transaction = Transaction.objects.create(user=user, payable=cart.payable, is_payed=True)
        transaction.items.set(cart.items.all())
        user.books.set(cart.items.all())
        cart.delete()
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response({'message':'you\'r cart is empty'})

def notpayedtr(user):
    try:
        cart = Cart.objects.get(user=user)
        transaction = Transaction.objects.create(user=user,  payable=cart.payable, is_payed=False)
        transaction.items.set(cart.items.all())
        cart.delete()
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_402_PAYMENT_REQUIRED)
    except:
        return Response({'message':'you\'r cart is empty'})

class Checkout(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        mimic_gateway = 'http://192.168.1.2:8000/gateway/'
        response = requests.get(mimic_gateway)

        if response.status_code == 200:
            return payedtr(user)
            
        if response.status_code == 400:
            return notpayedtr(user)

    # def post(self, request):
    #     return Response({'message':'sdaasdasd'})