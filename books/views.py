from django.shortcuts import render, redirect
from django.contrib import messages
from django.shortcuts import render, get_object_or_404, redirect
from .models import Book
from .forms import BookForm  # تأكد إنك عملت BookForm

def add_book(request):
    if request.method == "POST":
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, "Book added successfully!")  # ← أضف الرسالة هنا
            return redirect('add_book') # غير 'home' لأي صفحة مناسبة عندك
    else:
        form = BookForm()
    return render(request, 'addbook.html', {'form': form})


def edit_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    if request.method == "POST":
        form = BookForm(request.POST, request.FILES, instance=book)
        if form.is_valid():
            form.save()
            messages.success(request, "The book was successfully updated in the library.")
            return redirect('edit_book', book_id=book.id)  # أو أي صفحة مناسبة بعد التعديل
    else:
        form = BookForm(instance=book)
    return render(request, "editbook.html", {"form": form})

def book_list(request):
    books = Book.objects.all()
    return render(request, 'book_list.html', {'books': books})

def delete_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    book.delete()
    messages.success(request, "Book deleted successfully!")
    return redirect('book_list')  # رجّع المستخدم لقائمة الكتب بعد الحذف