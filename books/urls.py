from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_book, name='add_book'),
    path('edit/<int:book_id>/', views.edit_book, name='edit_book'),
    path('delete/<int:book_id>/', views.delete_book, name='delete_book'),
    path('like/<int:book_id>/', views.like_book, name='like_book'),
    path('book/<int:book_id>/', views.book_description, name='book_description'),
    path('book/<int:book_id>/borrow/', views.borrow_book_user, name='borrow_book_user'),
    path('admin/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/stats/', views.admin_stats, name='admin_stats'),
    path('book/<int:book_id>/return/', views.return_book, name='return_book'),
    path('admin/book/<int:book_id>/borrow/', views.borrow_book, name='borrow_book'),
]
