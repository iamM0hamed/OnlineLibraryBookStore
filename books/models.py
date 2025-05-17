from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=120)
    category = models.CharField(max_length=100)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True)
    available = models.BooleanField(default=True)
    likes = models.PositiveIntegerField(default=0)  # Count of likes
    liked_by = models.ManyToManyField(User, related_name='favorite_books', blank=True)  # Users who liked this book
    borrowed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='borrowed_books')  # Track borrowing user

    def __str__(self):
        return self.title

    def toggle_like(self, user):
        """Toggle like status for a user."""
        if self.liked_by.filter(id=user.id).exists():
            self.liked_by.remove(user)
            self.likes = self.liked_by.count()
            liked = False
        else:
            self.liked_by.add(user)
            self.likes = self.liked_by.count()
            liked = True
        self.save()
        return liked

