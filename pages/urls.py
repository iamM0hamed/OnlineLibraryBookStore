from django.urls import path
from . import views

app_name = 'pages'

urlpatterns = [
    path('about/', views.about_us, name='about'),
    path('team/', views.our_team, name='team'),
    path('contact/', views.contact_us, name='contact'),
] 