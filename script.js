// HEADER SCROLL EFFECT
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  header.classList.toggle("scrolled", window.scrollY > 50);
});

// MOBILE MENU TOGGLE
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    
    if (target) {
      const headerHeight = 80;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  });
});


// INTERSECTION OBSERVER - REVEAL ANIMATIONS
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { 
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

// Observe reveal elements
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// STRENGTHS CARDS ANIMATION
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('show');
      }, index * 150);
    }
  });
}, { 
  threshold: 0.2 
});

document.querySelectorAll('.strengths-card').forEach(card => {
  cardObserver.observe(card);
});

// STATS COUNTER ANIMATION
const counters = document.querySelectorAll('.counter');
const statsSection = document.querySelector('.stats-section');
let countersAnimated = false;

function animateCounter(counter) {
  const target = parseFloat(counter.dataset.target);
  const isDecimal = target % 1 !== 0;
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    
    if (current < target) {
      counter.innerText = isDecimal ? current.toFixed(2) : Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      counter.innerText = isDecimal ? target.toFixed(2) : target;
    }
  };

  updateCounter();
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersAnimated) {
      countersAnimated = true;
      
      // Animate stats with stagger
      const stats = document.querySelectorAll('.stat');
      stats.forEach((stat, index) => {
        setTimeout(() => {
          stat.classList.add('show');
        }, index * 200);
      });
      
      // Animate counters
      counters.forEach(counter => {
        animateCounter(counter);
      });
      
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

if (statsSection) {
  statsObserver.observe(statsSection);
}

// CLIENT LOGOS SLIDER
const logoTrack = document.querySelector('.logo-track');

if (logoTrack) {
  logoTrack.addEventListener('mouseenter', () => {
    logoTrack.style.animationPlayState = 'paused';
  });

  logoTrack.addEventListener('mouseleave', () => {
    logoTrack.style.animationPlayState = 'running';
  });
}

// CONTACT FORM HANDLING
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Get form values
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      company: document.getElementById('company').value,
      message: document.getElementById('message').value
    };

    try {

      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          service_id: "service_qe3rbul",
          template_id: "template_5dyosuk",
          user_id: "trV-sbcVG1oTgQAxZ",
          template_params: formData
        })
      });
      
      if (response.ok) {
        showFormStatus('success', 'Message sent successfully! We will get back to you soon.');
        contactForm.reset();
      } else {
        throw new Error('Failed to send message');
      }
      
    } catch (error) {
      console.error('Error:', error);
      showFormStatus('error', 'Failed to send message. Please try again or contact us directly via email.');
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function showFormStatus(type, message) {
  formStatus.className = `form-status ${type}`;
  formStatus.textContent = message;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    formStatus.style.display = 'none';
  }, 5000);
}

// Form input animation
const formControls = document.querySelectorAll('.form-control');
formControls.forEach(control => {
  control.addEventListener('focus', function() {
    this.parentElement.style.transform = 'translateY(-2px)';
  });
  
  control.addEventListener('blur', function() {
    this.parentElement.style.transform = 'translateY(0)';
  });
});

// PARALLAX EFFECT
let ticking = false;

function updateParallax() {
  const aboutImage = document.querySelector('.about-image img');
  
  if (aboutImage) {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.05;
    
    aboutImage.style.transform = `scale(1.1) translateY(${rate}px)`;
  }
  
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

// PAGE LOAD ANIMATION
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});


// Keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  }
});

// Focus trap for mobile menu
const focusableElements = navMenu.querySelectorAll('a, button');
const firstFocusable = focusableElements[0];
const lastFocusable = focusableElements[focusableElements.length - 1];

navMenu.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }
});
