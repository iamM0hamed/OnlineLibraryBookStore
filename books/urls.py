from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_book, name='add_book'),
    path('edit/<int:book_id>/', views.edit_book, name='edit_book'),
    path('', views.book_list, name='book_list'),  # ← ده الجديد
    path('delete/<int:book_id>/', views.delete_book, name='delete_book'),
]
