from django.urls import path
from .views import *


urlpatterns = [
    path('', book, name='book'),
    path('cats/', categories, name='cats'),
    path('cats/detail/', categories_list, name='cat_list'),
    path('prs/', premium_list, name='prlist'),
    path('prs/pr/', prbook, name='pr'),
    path('new/', NewBooksView.as_view(), name='new-books'),
    path('popular/', PopularBooksView.as_view(), name='popular-books'),
    path('category/', CategorisView.as_view(), name='cat'),
    path('category/<int:cat_id>/', BookListView.as_view(), name='books-in-cat'),
    path('<int:book_id>/', BookView.as_view(), name='book_view'),
    path('premiumbooks/', PremiumBookListView.as_view(), name='premium-books'),
    path('prs/pr/<int:book_id>/', PremiumBookView.as_view(), name='premium-book'),
    path('comments/<int:book_id>/', CommentListView.as_view(), name='comment-list-create'),
    path('comments/<int:comment_id>/', CommentUpdateView.as_view(), name='comment-update'),

]