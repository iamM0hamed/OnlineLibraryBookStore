from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
import random
import string
from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session


def index(request):
    return render(request, 'index.html')

def signup(request):
    if request.method == 'POST':
        first_name = request.POST.get('Fname')
        last_name = request.POST.get('Lname')
        email = request.POST.get('email')
        password = request.POST.get('password')
        is_admin = request.POST.get('admin-checkbox')

        # Check if user already exists
        if User.objects.filter(username=email).exists():
            return render(request, 'sign-up.html', {'error': 'User already exists!'})

        # Determine user type
        if is_admin:
            secret_key = request.POST.get('secret-key')
            if secret_key.lower() != 'say my name':  # Validate admin secret key
                return render(request, 'sign-up.html', {'error': 'Invalid secret key for admin account!'})

            # Create superuser (Full Admin Access)
            user = User.objects.create_superuser(username=email, email=email, password=password)
        else:
            # Create a regular user
            user = User.objects.create_user(username=email, email=email, password=password)

        user.first_name = first_name
        user.last_name = last_name
        user.save()

        # Log the user in after registration
        login(request, user)

        # Redirect based on role
        if is_admin:
            return redirect('mainadmin')  # Redirect admin to main dashboard
        else:
            return redirect('dashboard')  # Redirect normal user

    return render(request, 'sign-up.html')


def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            if user.is_superuser:
                return redirect('mainadmin')
            else:
                return redirect('dashboard')
        else:
            return render(request, 'logIn.html', {'error': 'Invalid email or password'})

    return render(request, 'logIn.html')

def forgetPassword(request):
    if request.method == 'POST':
        email = request.POST.get('email')

        # Check if the email exists in the database
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return render(request, 'forgetpass1.html', {'error': 'Email not found!'})

        # Generate a random 8-character reset code
        reset_code = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        
        # Store the reset code in session
        request.session['reset_code'] = reset_code
        request.session['reset_email'] = email

        # Send the reset code via email
        send_mail(
            'Password Reset Code',
            f'Your password reset code is: {reset_code}',
            'yourlibrary@example.com',
            [email],
            fail_silently=False,
        )

        return redirect('forgetpass2')  # Move to next step

    return render(request, 'forgetpass1.html')

def verifyResetCode(request):
    if request.method == 'POST':
        entered_code = request.POST.get('codeOF6')
        stored_code = request.session.get('reset_code')

        if entered_code != stored_code:
            return render(request, 'forgetpass2.html', {'error': 'Invalid reset code!'})

        return redirect('setNewPass')  # Proceed to set a new password

    return render(request, 'forgetpass2.html')

from django.contrib.auth.hashers import make_password

def setNewPassword(request):
    if request.method == 'POST':
        new_password = request.POST.get('password')
        email = request.session.get('reset_email')

        # Fetch user and update password
        user = User.objects.get(email=email)
        user.password = make_password(new_password)  # Securely hash the new password
        user.save()

        # Clear session after reset
        request.session.flush()

        return redirect('signin')  # Redirect to login after reset

    return render(request, 'setNewPass.html')
