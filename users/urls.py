from django.urls import path
from . import views
from books.views import book_list

urlpatterns = [
    path('', views.index, name='index'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('dashboard/', book_list, name='dashboard'),
    path('profile/', views.profile, name='profile'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('forget-password/', views.forgetPassword, name='forget-password'),
    path('verify-reset/', views.verifyResetCode, name='verify-reset'),
    path('set-password/', views.setNewPassword, name='set-password'),
]
