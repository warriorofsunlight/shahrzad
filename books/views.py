from django.shortcuts import render

from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import *
from .serializer import *

# Create your views here.

def book(request):
    return render(request, 'book.html')

def categories(request):
    return render(request, 'category.html')

def categories_list(request):
    return render(request, 'categorydetail.html')

def premium_list(request):
    return render(request, 'prlist.html')

def prbook(request):
    return render(request, 'prbook.html')



class BookView(APIView):
    def get(self, request, book_id):
        try:
            book = Book.objects.get(pk=book_id)
            serializer = BookSerializer(book)

            return Response(serializer.data)
        except Book.DoesNotExist:
            return Response({'message':'book not found'}, status=status.HTTP_404_NOT_FOUND)
        


class BookListView(APIView):
    def get(self, request, cat_id):
        try:
            category = Category.objects.get(pk=cat_id)
            book = Book.objects.filter(category=category)
            serializer = BookSerializer(book, many=True)

            return Response(serializer.data)
        except Category.DoesNotExist or Book.DoesNotExist:
            return Response({'message':'no book or category found'}, status=status.HTTP_404_NOT_FOUND)


class NewBooksView(APIView):
    def get(self, request):
        try:
            newbooks = Book.objects.order_by('-created')[:8]
            serializer = BookSerializer(newbooks, many=True)

            return Response(serializer.data)
        except Book.DoesNotExist:
            return Response({'message':'no book found'}, status=status.HTTP_404_NOT_FOUND)
        

class PopularBooksView(APIView):
    def get(self, request):
        try:
            popularbooks = Book.objects.order_by('rate')[:8]
            serializer = BookSerializer(popularbooks, many=True)

            return Response(serializer.data)
        except:
            return Response({'message':'no book found'}, status=status.HTTP_404_NOT_FOUND)
        

class PremiumBookListView(APIView):

    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.books.exists():
            books = user.books
            serializer = PremiumBookSerializer(books, many=True)

            return Response(serializer.data)
        else:
            return Response({'message':'you don\'t have any book right now'})


class PremiumBookView(APIView):

    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, book_id):
        user = request.user
        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response({'message':'book not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if user.books.filter(id=book_id).exists():
            serializer = PremiumBookSerializer(book)
            return Response(serializer.data)
        else:
            return Response({'message':'you don\'t own this book'})

        
class CategorisView(APIView):
    def get(self, request):
        try:
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)

            return Response(serializer.data)
        except:
            return Response({'message':'not category found'}, status=status.HTTP_404_NOT_FOUND)
        

class CommentListView(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, book_id):
        try:
            book = Book.objects.get(pk=book_id)
        except:
            return Response({'message':'book not found'}, status=status.HTTP_404_NOT_FOUND)
        try:
            comments = Comment.objects.filter(book=book)
            serializer = CommentSerializer(comments, many=True)

            return Response(serializer.data)
        except:
            return Response({'message':'this book has no comment'}, 
                            status=status.HTTP_404_NOT_FOUND)
        
    def post(seld, request, book_id):
        user = request.user
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            if request.user.is_authenticated:
                book = serializer.validated_data['book']

                if user.books.get(pk=book.id):
                    serializer.save(user=request.user)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response({'message':'you are not own this book'}, 
                                    status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({'message':'you are not signed in'})
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CommentUpdateView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, comment_id):
        comment = Comment.objects.get(pk=comment_id)
        if comment.user == request.user:
            serializer = CommentSerializer(comment, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "You can only update your own comments"},
                             status=status.HTTP_403_FORBIDDEN)