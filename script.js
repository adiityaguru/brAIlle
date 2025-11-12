// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = navList.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navList.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navToggle.contains(event.target) || navList.contains(event.target);
            if (!isClickInsideNav && navList.classList.contains('active')) {
                navList.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// Smooth scroll for navigation links (fallback for browsers that don't support CSS scroll-behavior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#" or empty
        if (href === '#' || href === '') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler (placeholder - would need backend integration)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, this would send data to a server
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}
