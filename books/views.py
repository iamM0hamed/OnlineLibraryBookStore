from django.shortcuts import render, redirect
from django.contrib import messages
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.template.loader import render_to_string
from .models import Book
from .forms import BookForm 

def is_admin(user):
    return user.is_staff

@user_passes_test(is_admin)
def admin_dashboard(request):
    """Admin dashboard view showing all books and their status."""
    books = Book.objects.all().select_related('borrowed_by')
    users = User.objects.filter(is_staff=False)
    context = {
        'books': books,
        'users': users,
        'total_books': books.count(),
        'borrowed_books': books.filter(borrowed_by__isnull=False).count(),
        'available_books': books.filter(borrowed_by__isnull=True).count(),
        'total_users': users.count()
    }
    return render(request, 'mainAdmin.html', context)

@user_passes_test(is_admin)
def admin_stats(request):
    """Return updated statistics for admin dashboard."""
    books = Book.objects.all()
    users = User.objects.filter(is_staff=False)
    return JsonResponse({
        'total_books': books.count(),
        'borrowed_books': books.filter(borrowed_by__isnull=False).count(),
        'available_books': books.filter(borrowed_by__isnull=True).count(),
        'total_users': users.count()
    })

@user_passes_test(is_admin)
def return_book(request, book_id):
    """Handle book returns."""
    book = get_object_or_404(Book, id=book_id)
    if book.borrowed_by:
        book.borrowed_by = None
        book.available = True
        book.save()
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            book_html = render_to_string('book_card.html', {'book': book})
            return JsonResponse({'success': True, 'book_html': book_html})
        messages.success(request, f"'{book.title}' has been returned successfully.")
    return redirect('admin_dashboard')

@user_passes_test(is_admin)
def borrow_book(request, book_id):
    """Handle book borrowing."""
    if request.method == "POST":
        book = get_object_or_404(Book, id=book_id)
        user_id = request.POST.get('user_id')
        if user_id:
            user = get_object_or_404(User, id=user_id)
            if book.available:
                book.borrowed_by = user
                book.available = False
                book.save()
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    book_html = render_to_string('book_card.html', {'book': book})
                    return JsonResponse({'success': True, 'book_html': book_html})
                messages.success(request, f"'{book.title}' has been borrowed by {user.username}.")
            else:
                messages.error(request, "This book is not available for borrowing.")
        else:
            messages.error(request, "Please select a user to borrow the book.")
    return redirect('admin_dashboard')

@user_passes_test(is_admin)
def add_book(request):
    if request.method == "POST":
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            book = form.save()
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                book_html = render_to_string('book_card.html', {'book': book})
                return JsonResponse({'success': True, 'book_html': book_html})
            messages.success(request, "Book added successfully!")
            return redirect('admin_dashboard')
    else:
        form = BookForm()
    return render(request, 'addbook.html', {'form': form})

@user_passes_test(is_admin)
def edit_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    if request.method == "POST":
        form = BookForm(request.POST, request.FILES, instance=book)
        if form.is_valid():
            book = form.save()
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                book_html = render_to_string('book_card.html', {'book': book})
                return JsonResponse({'success': True, 'book_html': book_html})
            messages.success(request, "The book was successfully updated.")
            return redirect('admin_dashboard')
    else:
        form = BookForm(instance=book)
    return render(request, "editbook.html", {"form": form})

@login_required
def book_list(request):
    """Regular user dashboard view."""
    if request.user.is_staff:
        return redirect('admin_dashboard')
    books = Book.objects.all()
    return render(request, 'dashboard.html', {'books': books})

@user_passes_test(is_admin)
def delete_book(request, book_id):
    if request.method == "POST":
        book = get_object_or_404(Book, id=book_id)
        book.delete()
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': True})
        messages.success(request, "Book deleted successfully!")
        return redirect('admin_dashboard')
    return JsonResponse({'success': False}, status=405)

@login_required
def like_book(request, book_id):
    """Handles book likes."""
    if request.method == "POST":
        book = get_object_or_404(Book, id=book_id)
        liked = book.toggle_like(request.user)
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True, 
                'likes': book.likes,
                'liked': liked
            })
            
        if request.user.is_staff:
            return redirect('admin_dashboard')
        return redirect('dashboard')
    return JsonResponse({'success': False}, status=405)

@login_required
def borrow_book_user(request, book_id):
    """Handle book borrowing for regular users."""
    book = get_object_or_404(Book, id=book_id)
    if book.available:
        book.borrowed_by = request.user
        book.available = False
        book.save()
        messages.success(request, f"You have successfully borrowed '{book.title}'.")
    else:
        messages.error(request, "This book is not available for borrowing.")
    return redirect('book_description', book_id=book_id)

@login_required
def book_description(request, book_id):
    """Display detailed information about a specific book."""
    book = get_object_or_404(Book, id=book_id)
    context = {
        'book': book,
        'user': request.user,
        'is_borrowed_by_user': book.borrowed_by == request.user if book.borrowed_by else False
    }
    return render(request, 'BookDescription.html', context)