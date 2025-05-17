from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login, authenticate, logout
from django.contrib.auth.decorators import login_required
import random
import string
from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.contrib.sessions.models import Session
from django.contrib import messages
from books.models import Book
import re
from django.http import JsonResponse

def validate_password(password):
    """
    Validate that the password meets the following criteria:
    - At least 8 characters long
    - Contains at least one uppercase letter
    - Contains at least one lowercase letter
    - Contains at least one special character
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character"
    
    return True, ""

def is_ajax(request):
    return request.headers.get('X-Requested-With') == 'XMLHttpRequest'

def index(request):
    if request.user.is_authenticated:
        if request.user.is_staff:
            return redirect('admin_dashboard')
        return redirect('dashboard')
    return render(request, 'index.html')

def signup(request):
    if request.user.is_authenticated:
        if request.user.is_staff:
            return redirect('admin_dashboard')
        return redirect('dashboard')

    if request.method == 'POST':
        # Store form data
        form_data = {
            'first_name': request.POST.get('Fname', ''),
            'last_name': request.POST.get('Lname', ''),
            'email': request.POST.get('email', ''),
            'is_admin': request.POST.get('admin-checkbox') == 'on'
        }

        # Debug prints
        print("Form data received:", form_data)

        first_name = form_data['first_name']
        last_name = form_data['last_name']
        email = form_data['email']
        password = request.POST.get('password')
        confirm_password = request.POST.get('pass')
        is_admin = form_data['is_admin']

        error_message = None

        # Validate required fields
        if not all([first_name, last_name, email, password, confirm_password]):
            error_message = 'All fields are required!'
            print("Validation failed: Missing required fields")

        # Check if passwords match
        elif password != confirm_password:
            error_message = 'Passwords do not match!'
            print("Validation failed: Passwords don't match")

        # Validate password strength
        elif not error_message:
            is_valid, pwd_error = validate_password(password)
            if not is_valid:
                error_message = pwd_error
                print(f"Validation failed: Password requirements - {pwd_error}")

        # Check if user already exists
        elif User.objects.filter(username=email).exists():
            error_message = 'This email is already registered. Please use a different email or login.'
            print("Validation failed: Email already exists")

        # Validate admin secret key
        elif is_admin:
            secret_key = request.POST.get('secret-key')
            if not secret_key or secret_key.lower() != 'say my name':
                error_message = 'Invalid secret key for admin account!'
                print("Validation failed: Invalid admin secret key")

        if error_message:
            print(f"Returning error: {error_message}")
            return render(request, 'sign-up.html', {'error': error_message, 'form_data': form_data})

        try:
            print("Creating user...")
            # Create user based on type
            if is_admin:
                user = User.objects.create_superuser(username=email, email=email, password=password)
            else:
                user = User.objects.create_user(username=email, email=email, password=password)

            user.first_name = first_name
            user.last_name = last_name
            user.save()

            # Log the user in
            auth_login(request, user)

            success_message = 'Account created successfully!'
            messages.success(request, success_message)
            
            # Redirect based on user type
            if is_admin:
                return redirect('admin_dashboard')
            else:
                return redirect('dashboard')

        except Exception as e:
            error_message = f'An error occurred: {str(e)}'
            print(f"Exception during user creation: {error_message}")
            return render(request, 'sign-up.html', {'error': error_message, 'form_data': form_data})

    # GET request
    return render(request, 'sign-up.html', {'form_data': None})

def user_login(request):
    if request.user.is_authenticated:
        if request.user.is_staff:
            return redirect('admin_dashboard')
        return redirect('dashboard')

    context = {
        'form_data': None,
        'error': None
    }

    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Store email to repopulate the form
        context['form_data'] = {'email': email}

        error_message = None

        if not email or not password:
            error_message = 'Both email and password are required!'

        if error_message:
            if is_ajax(request):
                return JsonResponse({'error': error_message}, status=400)
            messages.error(request, error_message)
            return render(request, 'logIn.html', context)

        user = authenticate(request, username=email, password=password)

        if user is not None:
            auth_login(request, user)
            messages.success(request, f'Welcome back, {user.first_name}!')
            
            if is_ajax(request):
                return JsonResponse({
                    'success': True,
                    'redirect': '/admin_dashboard' if user.is_staff else '/dashboard'
                })
            
            if user.is_staff:
                return redirect('admin_dashboard')
            else:
                return redirect('dashboard')
        else:
            error_message = 'Invalid email or password'
            if is_ajax(request):
                return JsonResponse({'error': error_message}, status=400)
            messages.error(request, error_message)
            return render(request, 'logIn.html', context)

    return render(request, 'logIn.html', context)

@login_required
def user_logout(request):
    # Clear all session data
    request.session.flush()
    # Logout the user
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    # Redirect to the index page
    return redirect('index')

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

        return redirect('forgetpass2')

    return render(request, 'forgetpass1.html')

def verifyResetCode(request):
    if request.method == 'POST':
        entered_code = request.POST.get('codeOF6')
        stored_code = request.session.get('reset_code')

        if entered_code != stored_code:
            return render(request, 'forgetpass2.html', {'error': 'Invalid reset code!'})

        return redirect('setNewPass')

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

@login_required
def profile(request):
    """User profile view."""
    # Get user's borrowed books
    borrowed_books = Book.objects.filter(borrowed_by=request.user)
    # Get user's favorite books
    favorite_books = request.user.favorite_books.all()
    
    context = {
        'user': request.user,
        'borrowed_books': borrowed_books,
        'favorite_books': favorite_books
    }
    
    return render(request, 'ProfilePage.html', context)

@login_required
def edit_profile(request):
    """Edit profile view."""
    if request.method == 'POST':
        # Get form data
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        current_password = request.POST.get('current_password')
        new_password = request.POST.get('new_password')
        
        user = request.user
        
        # Update basic info
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        if email and email != user.email:
            if User.objects.filter(email=email).exclude(id=user.id).exists():
                messages.error(request, 'Email already exists!')
            else:
                user.email = email
                user.username = email  # Since we use email as username
        
        # Update password if provided
        if current_password and new_password:
            if user.check_password(current_password):
                user.set_password(new_password)
                messages.success(request, 'Password updated successfully!')
            else:
                messages.error(request, 'Current password is incorrect!')
        
        user.save()
        messages.success(request, 'Profile updated successfully!')
        return redirect('profile')
    
    return render(request, 'edit_profile.html', {'user': request.user})