
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
let currentPositionFilter = '';
let currentScheduleFilter = '';

function filterJobs() {
    const positionFilter = currentPositionFilter;
    const scheduleFilter = currentScheduleFilter;
    
    const jobCards = document.querySelectorAll('.job-card');
    const jobContainer = document.getElementById('jobListings');
    const noJobsMessage = document.getElementById('noJobsMessage');
    let visibleJobs = 0;
    
    // First pass: determine which jobs match
    const matchingCards = [];
    jobCards.forEach(card => {
        const position = card.getAttribute('data-position');
        const schedule = card.getAttribute('data-schedule');
        
        const positionMatch = !positionFilter || position === positionFilter;
        const scheduleMatch = !scheduleFilter || schedule === scheduleFilter;
        
        if (positionMatch && scheduleMatch) {
            matchingCards.push(card.parentElement); // Get the column wrapper
            visibleJobs++;
        }
    });
    
    // Clear the container and re-add only matching cards
    if (jobContainer) {
        // Hide all cards first
        jobCards.forEach(card => {
            card.parentElement.style.display = 'none';
        });
        
        // Show matching cards
        matchingCards.forEach(cardColumn => {
            cardColumn.style.display = 'block';
        });
    }
    
    // Show/hide no jobs message
    if (noJobsMessage) {
        if (visibleJobs === 0) {
            noJobsMessage.style.display = 'block';
        } else {
            noJobsMessage.style.display = 'none';
        }
    }
}

// Add event listeners for job filter dropdowns
document.addEventListener('DOMContentLoaded', function() {
    // Position filter dropdown listeners
    document.querySelectorAll('.position-filter').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            
            currentPositionFilter = value;
            
            // Update display text in button
            const positionText = document.getElementById('positionText');
            if (positionText) {
                positionText.textContent = text;
            }
            
            filterJobs();
        });
    });
    
    // Schedule filter dropdown listeners
    document.querySelectorAll('.schedule-filter').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            
            currentScheduleFilter = value;
            
            // Update display text in button
            const scheduleText = document.getElementById('scheduleText');
            if (scheduleText) {
                scheduleText.textContent = text;
            }
            
            filterJobs();
        });
    });
    
    // Initial filter call
    filterJobs();
});
