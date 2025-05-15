from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login , name='login'),
    path('forgetpassword/', views.forgetPassword , name='forgetpassword'),
    path('forget-password/', views.forgetPassword, name='forget-password'),
    path('verify-reset/', views.verifyResetCode, name='forgetpass2'),
    path('set-password/', views.setNewPassword, name='setNewPass'),
    path('verify-reset/', views.verifyResetCode, name='contact'),
    path('set-password/', views.setNewPassword, name='aboutus'),

]
