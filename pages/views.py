from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from .forms import ContactForm

# Hardcoded team members data
TEAM_MEMBERS = [
    {
        'name': 'John Smith',
        'role': 'Library Director',
        'bio': 'John has over 15 years of experience in digital library management and is passionate about making knowledge accessible to everyone.',
        'email': 'john.smith@library.com',
        'linkedin': 'https://linkedin.com/in/johnsmith',
        'github': 'https://github.com/johnsmith'
    },
    {
        'name': 'Sarah Johnson',
        'role': 'Head Librarian',
        'bio': 'Sarah specializes in digital cataloging and helps maintain our vast collection of e-books.',
        'email': 'sarah.johnson@library.com',
        'linkedin': 'https://linkedin.com/in/sarahjohnson'
    },
    {
        'name': 'Mike Chen',
        'role': 'Technical Lead',
        'bio': 'Mike ensures our digital platform runs smoothly and implements new features to enhance user experience.',
        'email': 'mike.chen@library.com',
        'github': 'https://github.com/mikechen'
    }
]

def about_us(request):
    """About Us page view."""
    context = {
        'title': 'About Us',
        'description': '''
        Welcome to the Online Library, your digital gateway to knowledge and literature. 
        Our mission is to make books accessible to everyone, anywhere, at any time. 
        We believe in the power of reading to transform lives and foster lifelong learning.
        '''
    }
    return render(request, 'pages/about.html', context)

def our_team(request):
    """Our Team page view."""
    context = {
        'title': 'Our Team',
        'team_members': TEAM_MEMBERS
    }
    return render(request, 'pages/team.html', context)

def contact_us(request):
    """Contact Us page view with email handling."""
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # Get form data
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            
            # Prepare email message
            email_message = f"""
            New contact form submission from {name}
            
            From: {email}
            Subject: {subject}
            
            Message:
            {message}
            """
            
            # Send email
            try:
                send_mail(
                    subject=f'Contact Form: {subject}',
                    message=email_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.CONTACT_EMAIL],
                    fail_silently=False,
                )
                messages.success(request, 'Your message has been sent successfully! We will get back to you soon.')
            except Exception as e:
                messages.error(request, 'Sorry, there was an error sending your message. Please try again later.')
            
            return redirect('pages:contact')
    else:
        form = ContactForm()

    context = {
        'title': 'Contact Us',
        'form': form
    }
    return render(request, 'pages/contact.html', context)
