
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = 90;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handler
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    
    // Reset form
    this.reset();
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide success message after 10 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 10000);
});

// Set minimum date to tomorrow for the date picker
const dateInput = document.getElementById('date');
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
dateInput.min = tomorrow.toISOString().split('T')[0];

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe menu items and recipe cards
document.querySelectorAll('.menu-item, .recipe-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});
