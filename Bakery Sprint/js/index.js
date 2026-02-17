
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
document.getElementById('orderForm')?.addEventListener('submit', function(e) {
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

// Job application form submission handler
document.getElementById('applicationForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    
    // Reset form
    this.reset();
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide success message after 15 seconds (longer for application)
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 15000);
});

// Set minimum date to tomorrow for the date picker
const dateInput = document.getElementById('date');
const availabilityInput = document.getElementById('availability');
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowString = tomorrow.toISOString().split('T')[0];

if (dateInput) {
    dateInput.min = tomorrowString;
}

if (availabilityInput) {
    availabilityInput.min = tomorrowString;
}

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

// Job filtering functionality
function filterJobs() {
    const positionFilter = document.getElementById('positionFilter')?.value || '';
    const locationFilter = document.getElementById('locationFilter')?.value || '';
    const scheduleFilter = document.getElementById('scheduleFilter')?.value || '';
    
    const jobCards = document.querySelectorAll('.job-card');
    const noJobsMessage = document.getElementById('noJobsMessage');
    let visibleJobs = 0;
    
    jobCards.forEach(card => {
        const position = card.getAttribute('data-position');
        const location = card.getAttribute('data-location');
        const schedule = card.getAttribute('data-schedule');
        
        const positionMatch = !positionFilter || position === positionFilter;
        const locationMatch = !locationFilter || location === locationFilter;
        const scheduleMatch = !scheduleFilter || schedule === scheduleFilter;
        
        if (positionMatch && locationMatch && scheduleMatch) {
            card.style.display = 'block';
            visibleJobs++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no jobs message
    if (noJobsMessage) {
        if (visibleJobs === 0) {
            noJobsMessage.style.display = 'block';
        } else {
            noJobsMessage.style.display = 'none';
        }
    }
}

// Add event listeners for job filters
document.getElementById('positionFilter')?.addEventListener('change', filterJobs);
document.getElementById('locationFilter')?.addEventListener('change', filterJobs);
document.getElementById('scheduleFilter')?.addEventListener('change', filterJobs);
