// Bakery Navigation Configuration for Hearth & Crust Artisan Bakery
const navItems = [
  { text: 'Home', url: 'index.html', icon: '🏠' },
  { text: 'Menu', url: 'pages/menu.html', icon: '🍞' },
  { text: 'Custom Orders', url: 'pages/special-order.html', icon: '🎂' },
  { text: 'Recipes', url: 'pages/recipe-blog.html', icon: '🍰' },
  { text: 'Careers', url: 'pages/careers.html', icon: '💼' },
  { text: 'About', url: 'pages/about.html', icon: 'ℹ️' },
  { text: 'Contact', url: 'pages/contact.html', icon: '📞' }
];

function createNavBar(location = 'root') {
  // Create simple navbar structure (no Bootstrap collapse)
  const nav = $('<nav>').addClass('navbar main-navigation');
  const container = $('<div>').addClass('container-fluid');
  
  // Brand/Logo
  const brand = $('<a>').addClass('navbar-brand bakery-brand').attr('href', location === 'pages' ? '../index.html' : 'index.html');
  brand.text('Hearth & Crust');
  
  // Desktop navigation
  const navList = $('<ul>').addClass('desktop-nav');
  
  navItems.forEach(item => {
    const li = $('<li>').addClass('nav-item');
    const a = $('<a>').addClass('nav-link bakery-nav-link');
    
    // Adjust href based on location
    if (location === 'pages') {
      a.attr('href', item.url === 'index.html' ? '../' + item.url : item.url.replace('pages/', ''));
    } else {
      a.attr('href', item.url);
    }
    
    // Add icon and text
    const iconSpan = $('<span>').addClass('nav-icon').text(item.icon);
    const textSpan = $('<span>').addClass('nav-text').text(item.text);
    
    a.append(iconSpan).append(' ').append(textSpan);
    li.append(a);
    navList.append(li);
  });
  
  // Mobile toggle button (no Bootstrap data attributes)
  const toggleButton = $('<button>').addClass('navbar-toggler').attr({
    'type': 'button',
    'aria-expanded': 'false',
    'aria-label': 'Toggle navigation',
    'tabindex': '0'
  });
  toggleButton.html('<span class="navbar-toggler-icon"></span>');
  
  container.append(brand).append(navList).append(toggleButton);
  nav.append(container);
  
  return nav;
}

function createMobileMenu(location = 'root') {
  const mobileMenu = $('<div>').addClass('mobile-menu');
  const ul = $('<ul>').addClass('mobile-menu-list');
  
  navItems.forEach(item => {
    const li = $('<li>').addClass('mobile-menu-item');
    const a = $('<a>').addClass('mobile-nav-link');
    
    if (location === 'pages') {
      a.attr('href', item.url === 'index.html' ? '../' + item.url : item.url.replace('pages/', ''));
    } else {
      a.attr('href', item.url);
    }
    
    const iconSpan = $('<span>').addClass('mobile-nav-icon').text(item.icon);
    const textSpan = $('<span>').addClass('mobile-nav-text').text(item.text);
    
    a.append(iconSpan).append(' ').append(textSpan);
    li.append(a);
    ul.append(li);
  });
  
  mobileMenu.append(ul);
  return mobileMenu;
}

$(document).ready(function() {
  // Determine current location
  const location = window.location.pathname.includes('/pages/') ? 'pages' : 'root';
  
  // Create and insert navigation
  const $navbar = createNavBar(location);
  const $mobileMenu = createMobileMenu(location);
  
  // Replace existing nav or add to body
  const $existingNav = $('nav');
  if ($existingNav.length) {
    $existingNav.replaceWith($navbar);
  } else {
    $('body').prepend($navbar);
  }
  
  $('body').append($mobileMenu);
  
  // Simple mobile menu toggle - no conflicts, no Bootstrap interference
  let isMenuOpen = false;
  
  function toggleMobileMenu() {
    const $toggleButton = $('.navbar-toggler');
    
    if (isMenuOpen) {
      $mobileMenu.removeClass('show');
      $toggleButton.attr('aria-expanded', 'false').removeClass('active');
      isMenuOpen = false;
    } else {
      $mobileMenu.addClass('show');
      $toggleButton.attr('aria-expanded', 'true').addClass('active');
      isMenuOpen = true;
    }
  }
  
  // Single click handler - no conflicts
  $(document).on('click', '.navbar-toggler', function(e) {
    e.preventDefault();
    toggleMobileMenu();
  });
  
  // Keyboard accessibility
  $(document).on('keydown', '.navbar-toggler', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMobileMenu();
    }
  });
  
  // Close menu when clicking outside
  $(document).on('click', function(e) {
    if (isMenuOpen && !$(e.target).closest('.navbar-toggler, .mobile-menu').length) {
      toggleMobileMenu();
    }
  });
  
  // Close menu when clicking on a link
  $(document).on('click', '.mobile-nav-link', function() {
    if (isMenuOpen) {
      toggleMobileMenu();
    }
  });
  
  // Show navbar after everything is ready
  setTimeout(function() {
    $navbar.addClass('navbar-ready');
    $mobileMenu.addClass('menu-ready');
    $('body').addClass('content-ready');
  }, 100);
  
  // Handle navbar scroll effect
  $(window).on('scroll', function() {
    const scrollTop = $(this).scrollTop();
    const $navbar = $('.main-navigation');
    
    if (scrollTop > 100) {
      $navbar.css({
        'background': 'rgba(255, 248, 240, 0.98)',
        'box-shadow': '0 4px 25px rgba(74, 52, 40, 0.2)'
      });
    } else {
      $navbar.css({
        'background': 'rgba(255, 248, 240, 0.95)',
        'box-shadow': '0 2px 20px rgba(74, 52, 40, 0.15)'
      });
    }
  });
  
  // Smooth scrolling for anchor links
  $(document).on('click', 'a[href^="#"]', function(e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      const navHeight = 90;
      const targetPosition = target.offset().top - navHeight;
      $('html, body').animate({
        scrollTop: targetPosition
      }, 500);
    }
  });
  
  // Highlight active navigation item
  function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    $('.bakery-nav-link, .mobile-nav-link').removeClass('active');
    
    $('.bakery-nav-link, .mobile-nav-link').each(function() {
      const href = $(this).attr('href');
      const linkPage = href.split('/').pop();
      
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        $(this).addClass('active');
      }
    });
  }
  
  setActiveNavItem();
});
