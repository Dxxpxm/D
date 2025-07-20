
// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initCounterAnimation();
    initPortfolioFilters();
    initContactForm();
    initScrollToTop();
    initSmoothScrolling();
    initServiceCards();
    initCTAButton();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth scrolling functionality
function initSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('[data-scroll]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-scroll');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects (header background, scroll to top button, animations)
function initScrollEffects() {
    const header = document.querySelector('.header');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Header background effect
        if (scrollY > 100) {
            header.style.backgroundColor = 'rgba(var(--color-surface), 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'var(--color-surface)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        // Show/hide scroll to top button
        if (scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }

        // Animate elements on scroll
        animateOnScroll();
    }
    
    window.addEventListener('scroll', handleScroll);
}

// Counter animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    const animationDuration = 2000; // 2 seconds
    
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / (animationDuration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    }

    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Portfolio filtering functionality
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    // Form validation
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error styling
        field.classList.remove('error');
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Show/hide error
        let errorElement = field.parentNode.querySelector('.error-message');
        
        if (!isValid) {
            field.classList.add('error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.style.color = 'var(--color-error)';
                errorElement.style.fontSize = 'var(--font-size-sm)';
                errorElement.style.marginTop = 'var(--space-4)';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        } else if (errorElement) {
            errorElement.remove();
        }
        
        return isValid;
    }
    
    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isFormValid = true;
        
        // Validate all fields
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            // Show success message
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Remove any error styling
            formInputs.forEach(input => {
                input.classList.remove('error');
                const errorElement = input.parentNode.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                }
            });
        } else {
            showNotification('Please correct the errors in the form.', 'error');
        }
    });
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Service card interactions
function initServiceCards() {
    const serviceButtons = document.querySelectorAll('.service-card__button');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceCard = this.closest('.service-card');
            const serviceName = serviceCard.querySelector('.service-card__title').textContent;
            
            showNotification(`Learn more about ${serviceName} - Coming soon!`, 'info');
        });
    });
}

// CTA Button functionality
function initCTAButton() {
    const ctaButton = document.getElementById('ctaButton');
    
    ctaButton.addEventListener('click', function() {
        // Scroll to contact section
        const contactSection = document.getElementById('contact');
        const headerOffset = 80;
        const elementPosition = contactSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Focus on the name input after scrolling
        setTimeout(() => {
            const nameInput = document.getElementById('name');
            nameInput.focus();
        }, 800);
    });
}

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .stat-card, .contact-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in-up');
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: var(--space-24);
        background-color: var(--color-surface);
        color: var(--color-text);
        padding: var(--space-16) var(--space-24);
        border-radius: var(--radius-base);
        border-left: 4px solid var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'});
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform var(--duration-normal) var(--ease-standard);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Page load performance optimization
window.addEventListener('load', function() {
    // Hide loading state if any
    document.body.classList.add('loaded');
    
    // Initialize intersection observers for better performance
    initIntersectionObservers();
});

function initIntersectionObservers() {
    // Lazy load animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                animationObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements that should animate
    const elementsToAnimate = document.querySelectorAll('.service-card, .portfolio-item, .contact-item');
    elementsToAnimate.forEach(el => {
        animationObserver.observe(el);
    });
}

// Error handling for better user experience
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could show a user-friendly error message here
});

// Resize handler for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Close mobile menu on resize to larger screen
        if (window.innerWidth > 768) {
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');
            
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }, 250);
});
