// Enhanced Portfolio JavaScript with All Fixes
// ============================================

// Global Variables
let mouseX = 0;
let mouseY = 0;
let cursor = null;
let cursorFollower = null;
let typingInterval = null; // Fix for memory leak
let scrollThrottle = false; // Throttle for scroll performance

// CRITICAL FIX: Ensure home section is visible immediately
document.addEventListener('DOMContentLoaded', function() {
    // Force home section to be visible immediately
    const homeSection = document.querySelector('.home');
    if (homeSection) {
        homeSection.style.opacity = '1';
        homeSection.style.visibility = 'visible';
        homeSection.classList.add('visible', 'show-animate');
    }

    // Make all sections visible
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '1';
        section.style.visibility = 'visible';
    });
});

// Preloader with shorter delay
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                initializeAnimations();
            }, 500);
        }, 500); // Reduced delay
    }
});

// Initialize animations after preloader
function initializeAnimations() {
    const homeSection = document.querySelector('.home');
    if (homeSection) {
        homeSection.style.opacity = '1';
        homeSection.style.visibility = 'visible';
        homeSection.classList.add('show-animate');
    }

    // Start typing animation with proper cleanup
    startTypingAnimation();

    // Initialize all observers
    initializeObservers();

    // Animate home stats
    animateHomeStats();
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.classList.remove('bx-sun');
            themeIcon.classList.add('bx-moon');
        } else {
            themeIcon.classList.remove('bx-moon');
            themeIcon.classList.add('bx-sun');
        }
    }
}

// Custom Cursor (Desktop Only)
if (window.matchMedia("(hover: hover)").matches) {
    cursor = document.getElementById('cursor');
    cursorFollower = document.getElementById('cursorFollower');

    if (cursor && cursorFollower) {
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        });

        // Smooth follower animation
        function animateFollower() {
            followerX += (cursorX - followerX) * 0.2;
            followerY += (cursorY - followerY) * 0.2;

            cursorFollower.style.left = `${followerX}px`;
            cursorFollower.style.top = `${followerY}px`;

            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Add hover effects
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .btn, .filter-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.5)';
            });

            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }
}

// FIX: Throttled Scroll Event Handler
function throttledScroll() {
    if (!scrollThrottle) {
        window.requestAnimationFrame(() => {
            handleScroll();
            scrollThrottle = false;
        });
        scrollThrottle = true;
    }
}

// Scroll Progress Bar
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const progress = (scrollPosition / scrollHeight) * 100;

    if (scrollProgress) {
        scrollProgress.style.width = `${progress}%`;
    }

    // Update scroll to top button progress
    const progressCircle = document.getElementById('progressCircle');
    if (progressCircle) {
        const circumference = 2 * Math.PI * 20;
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }
}

// Particle Background Effect
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = window.innerWidth < 768 ? 20 : 40;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Call particle creation on DOM load
document.addEventListener('DOMContentLoaded', createParticles);

// FIX: Mobile Menu - Auto close on link click
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

if (menuIcon) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
}

// FIX: Close mobile menu when clicking a nav link
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        if (menuIcon && navbar) {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        }
    });
});

// Handle scroll events with throttling
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

function handleScroll() {
    // Update scroll progress
    updateScrollProgress();

    // Update active nav link
    sections.forEach((sec) => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach((link) => {
                link.classList.remove('active');
            });
            const targetLink = document.querySelector('header nav a[href*=' + id + ']');
            if (targetLink) {
                targetLink.classList.add('active');
            }
        }
    });

    // Sticky header
    const header = document.querySelector('.header');
    if (header) {
        header.classList.toggle('sticky', window.scrollY > 100);
    }

    // Close mobile menu on scroll
    if (menuIcon && navbar) {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    }
}

// Add throttled scroll listener
window.addEventListener('scroll', throttledScroll);

// FIX: Typing Animation with Memory Leak Prevention
const professionTexts = ['Computer Engineer', 'AI/ML Engineer', 'Deep Learning Expert', 'Software Developer'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeWriter() {
    const textElement = document.querySelector('.text-animate h3');
    if (!textElement) return;

    const currentText = professionTexts[textIndex];

    if (isDeleting) {
        textElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % professionTexts.length;
        typingSpeed = 500; // Pause before new text
    } else {
        typingSpeed = isDeleting ? 30 : 80;
    }

    // FIX: Store timeout reference for cleanup
    typingInterval = setTimeout(typeWriter, typingSpeed);
}

function startTypingAnimation() {
    // Clear any existing timeout before starting
    if (typingInterval) {
        clearTimeout(typingInterval);
    }
    setTimeout(typeWriter, 1000);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (typingInterval) {
        clearTimeout(typingInterval);
    }
});

// FIX: Project Filtering with Smooth Animations
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Smooth filter animation
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.classList.remove('hide');
                    card.classList.add('show');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        card.classList.add('hide');
                        card.classList.remove('show');
                    }, 300);
                }
            });
        });
    });
});

// FIX: Enhanced Form Validation with 2000 character limit
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');

    // Update character counter
    if (messageField && charCount) {
        messageField.addEventListener('input', () => {
            const count = messageField.value.length;
            charCount.textContent = count;

            // Change color when approaching limit
            const counter = document.querySelector('.char-counter');
            if (counter) {
                if (count > 1800) {
                    counter.style.color = 'var(--error-color)';
                } else {
                    counter.style.color = 'var(--text-color)';
                }
            }
        });
    }

    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-\+\(\)]{10,20}$/,
        subject: /^.{3,100}$/,
        message: /^[\s\S]{10,2000}$/ // Increased to 2000
    };

    // Validation messages
    const messages = {
        name: 'Please enter a valid name (2-50 characters)',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number',
        subject: 'Subject must be 3-100 characters',
        message: 'Message must be 10-2000 characters'
    };

    // Validate input
    function validateInput(input) {
        const inputName = input.name;
        const inputValue = input.value.trim();
        const pattern = patterns[inputName];
        const errorElement = input.parentElement.querySelector('.error-message');

        if (pattern && !pattern.test(inputValue)) {
            input.classList.add('error');
            input.classList.remove('success');
            if (errorElement) {
                errorElement.textContent = messages[inputName];
            }
            return false;
        } else {
            input.classList.remove('error');
            input.classList.add('success');
            if (errorElement) {
                errorElement.textContent = '';
            }
            return true;
        }
    }

    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                validateInput(input);
            }
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateInput(input);
            }
        });
    });

    // FIX: Form submission without redirect
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default submission

        let isValid = true;

        // Validate all inputs
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            const submitBtn = document.querySelector('.submit-btn');
            const originalBtnContent = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<span>Sending...</span><i class="bx bx-loader-alt bx-spin"></i>';
            submitBtn.disabled = true;

            // Create FormData
            const formData = new FormData(form);

            try {
                // Submit to FormSubmit via AJAX
                const response = await fetch('https://formsubmit.co/ajax/199b93fccd5350a03067eca9ad77d5da', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });

                if (response.ok) {
                    // Show success modal
                    showModal();

                    // Reset form
                    form.reset();
                    inputs.forEach(input => {
                        input.classList.remove('success', 'error');
                    });

                    // Reset character counter
                    if (charCount) {
                        charCount.textContent = '0';
                    }
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Sorry, there was an error sending your message. Please try again.');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
            }
        }
    });
});

// Modal Functions
function showModal() {
    const modal = document.getElementById('thankYouModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Auto-close modal after 3 seconds
        setTimeout(() => {
            closeModal();
        }, 3000);
    }
}

function closeModal() {
    const modal = document.getElementById('thankYouModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside or on close button
window.onclick = function(event) {
    const modal = document.getElementById('thankYouModal');
    if (event.target === modal) {
        closeModal();
    }
}

// ESC key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Counter Animation
function animateCounter(element, target, duration, isDecimal = false) {
    let start = 0;
    const increment = target / (duration / 16);
    let animationFrame;

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            if (isDecimal) {
                element.textContent = start.toFixed(2);
            } else {
                element.textContent = Math.floor(start).toLocaleString();
            }
            animationFrame = requestAnimationFrame(updateCounter);
        } else {
            if (isDecimal) {
                element.textContent = target.toFixed(2);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
    };

    updateCounter();
    return animationFrame;
}

// Animate Home Stats
function animateHomeStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseFloat(entry.target.getAttribute('data-target'));
                const isDecimal = target % 1 !== 0;
                animateCounter(entry.target, target, 2000, isDecimal);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// FIX: Enhanced Intersection Observer for Consistent Animations
function initializeObservers() {
    // Options for observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Skill Items Animation
    const skillItems = document.querySelectorAll('.skill-item');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');

                    // Animate skill progress bars
                    const progressBar = entry.target.querySelector('.skill-progress');
                    if (progressBar) {
                        const progress = progressBar.getAttribute('data-progress');
                        setTimeout(() => {
                            progressBar.style.width = progress + '%';
                        }, 300);
                    }
                }, index * 50); // Stagger animation
            }
        });
    }, observerOptions);

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });

    // Timeline Items Animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        item.style.transition = 'all 0.8s ease';
        timelineObserver.observe(item);
    });

    // Experience Cards Animation
    const experienceCards = document.querySelectorAll('.experience-card');
    const experienceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);

    experienceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        experienceObserver.observe(card);
    });

    // Achievement Cards Animation
    const achievementCards = document.querySelectorAll('.achievement-card');
    const achievementObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);

    achievementCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        achievementObserver.observe(card);
    });

    // Contact Stats Animation
    const contactStats = [
        { id: 'projectCount', value: 15, duration: 2000 },
        { id: 'coffeeCount', value: 515, duration: 2500 },
        { id: 'codeLines', value: 515151, duration: 3000 }
    ];

    const contactSection = document.querySelector('.contact');
    if (contactSection) {
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('stats-animated')) {
                    entry.target.classList.add('stats-animated');

                    contactStats.forEach(stat => {
                        const element = document.getElementById(stat.id);
                        if (element) {
                            animateCounter(element, stat.value, stat.duration);
                        }
                    });
                }
            });
        }, { threshold: 0.3 });

        contactObserver.observe(contactSection);
    }
}

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active nav
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('href') === href) {
                        navLink.classList.add('active');
                    }
                });
            }
        }
    });
});

// Parallax Effect for Home Section
let ticking = false;
function updateParallax() {
    const scrolled = window.pageYOffset;
    const homeSection = document.querySelector('.home');

    if (homeSection && scrolled < window.innerHeight) {
        const bgAnimation = document.querySelector('.bg-animation');
        if (bgAnimation) {
            bgAnimation.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Download CV Functionality
const downloadCV = document.getElementById('downloadCV');
if (downloadCV) {
    downloadCV.addEventListener('click', (e) => {
        e.preventDefault();

        // Create notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--main-color);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 0.8rem;
            font-size: 1.4rem;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = 'CV download will start shortly...';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);

        // Add actual download link here
        window.open('https://drive.google.com/file/d/1m3cGP_CMBYMqP0kOKR3zG10IqWAlzFon/view', '_blank');

//         window.location.href = 'https://drive.google.com/file/d/1m3cGP_CMBYMqP0kOKR3zG10IqWAlzFon/view';

    });
}

// Add CSS for loader animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .bx-spin {
        animation: spin 1s linear infinite;
    }

    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize Everything on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    // Ensure home section is visible
    const homeSection = document.querySelector('.home');
    if (homeSection) {
        homeSection.style.opacity = '1';
        homeSection.style.visibility = 'visible';
        homeSection.classList.add('visible', 'show-animate');
    }

    // Handle image loading - hide placeholders when images load successfully
    const images = document.querySelectorAll('.img-box img, .about-img img');
    images.forEach(img => {
        // Hide placeholder if image loads successfully
        img.addEventListener('load', function() {
            const placeholder = this.parentElement.querySelector('.img-placeholder, .img-placeholder-about');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        });

        // Show placeholder if image fails to load
        img.addEventListener('error', function() {
            const placeholder = this.parentElement.querySelector('.img-placeholder, .img-placeholder-about');
            if (placeholder) {
                placeholder.style.display = 'flex';
            }
            this.style.display = 'none';
        });

        // If image is already loaded (cached), hide placeholder
        if (img.complete && img.naturalHeight !== 0) {
            const placeholder = img.parentElement.querySelector('.img-placeholder, .img-placeholder-about');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
    });

    // Check initial scroll position
    if (window.scrollY === 0) {
        window.scrollTo(0, 1);
        window.scrollTo(0, 0);
    }

    // Trigger initial animations
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});

// Performance optimization - Debounce resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Re-initialize particles if needed
        if (window.innerWidth < 768) {
            const particlesContainer = document.getElementById('particles');
            if (particlesContainer) {
                particlesContainer.innerHTML = '';
                createParticles();
            }
        }
    }, 250);
});

// Ensure everything loads properly
window.addEventListener('load', () => {
    // Final check to ensure home section is visible
    const homeSection = document.querySelector('.home');
    if (homeSection) {
        homeSection.style.opacity = '1';
        homeSection.style.visibility = 'visible';
    }
});

// Service Worker Registration (Optional - for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch(() => {
            // Service worker registration failed - that's okay
        });
    });
}