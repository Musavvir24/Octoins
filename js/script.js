// Quote form submission
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navbar = document.getElementById('navbar');
  
  if (mobileMenuToggle && navbar) {
    mobileMenuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navbar.classList.toggle('active');
      
      // Close dropdowns when closing menu
      if (!navbar.classList.contains('active')) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navbar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navbar.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.querySelectorAll('.dropdown').forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    });
    
    // Close menu when clicking on a link (except dropdown buttons)
    document.querySelectorAll('nav a:not(.dropdown-btn)').forEach(link => {
      link.addEventListener('click', function() {
        navbar.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      });
    });
  }
  
  // Mobile Dropdown Toggle
  const dropdownBtns = document.querySelectorAll('.dropdown-btn');
  dropdownBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        const dropdown = this.parentElement;
        // Close other dropdowns
        document.querySelectorAll('.dropdown').forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });
        dropdown.classList.toggle('active');
      }
    });
  });
  
  // Close dropdown when clicking a link inside dropdown
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function() {
      const navbar = document.getElementById('navbar');
      const mobileMenuToggle = document.getElementById('mobileMenuToggle');
      if (window.innerWidth <= 900) {
        navbar.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.querySelectorAll('.dropdown').forEach(d => {
          d.classList.remove('active');
        });
      }
    });
  });
  
  const quoteForm = document.getElementById('quoteForm');
  
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const insuranceType = document.getElementById('insuranceType').value;
      const zipCode = document.getElementById('zipCode').value;
      
      // Create mailto link with form data
      const emailBody = `
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Insurance Type: ${insuranceType}
ZIP Code: ${zipCode}
      `.trim();
      
      // You'll update this email address later
      const recipientEmail = 'quotes@octopusinsurance.com';
      const mailtoLink = `mailto:${recipientEmail}?subject=Quote Request&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Reset form
      quoteForm.reset();
    });
  }
  
  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const phone = document.getElementById('contactPhone').value || 'Not provided';
      const message = document.getElementById('contactMessage').value;
      
      const emailBody = `
Contact Form Submission:

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}
      `.trim();
      
      const recipientEmail = 'info@octopusinsurance.com';
      const mailtoLink = `mailto:${recipientEmail}?subject=Contact Form Submission&body=${encodeURIComponent(emailBody)}`;
      
      window.location.href = mailtoLink;
      alert('Thank you for your message! Your email client should now open with your message ready to send. We\'ll get back to you soon!');
      contactForm.reset();
    });
  }
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* Quote iframe: listen for postMessage height updates from the EZlynx provider.
     If they send a height message we apply it; otherwise CSS handles the fixed height.
     We do NOT try to read cross-origin document dimensions (throws SecurityError).
  */
  (function quoteIframeMessage(){
    const iframe = document.getElementById('quote-iframe');
    if (!iframe) return;

    // If the iframe provider sends a postMessage with height info, apply it
    window.addEventListener('message', function(e) {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (!data) return;
        const h = data.height || data.iframeHeight || data.h;
        if (h && !isNaN(h) && parseInt(h, 10) > 400) {
          iframe.style.height = (parseInt(h, 10) + 4) + 'px';
        }
      } catch (err) {
        // ignore non-JSON or unrelated messages
      }
    });
  })();
});

// Form validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  const email = form.querySelector('input[type="email"]');
  const phone = form.querySelector('input[type="tel"]');
  
  if (email && !validateEmail(email.value)) {
    alert('Please enter a valid email address');
    return false;
  }
  
  if (phone && phone.value.replace(/\D/g, '').length < 10) {
    alert('Please enter a valid phone number');
    return false;
  }
  
  return true;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Format phone number
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 0) {
    if (value.length <= 3) {
      value = value;
    } else if (value.length <= 6) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    } else {
      value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
    }
  }
  input.value = value;
}
