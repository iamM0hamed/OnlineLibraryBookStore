from django.shortcuts import render

# Create your views here.
def signin(request):
    return render(request, 'sign-up.html')

def login(request):
    return render(request)