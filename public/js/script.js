// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event



// Mobile navigation
document.addEventListener('DOMContentLoaded', function() {
  const btnNav = document.querySelector('.btn-mobile-nav');
  const header = document.querySelector('.header');
  
  btnNav.addEventListener('click', function() {
    header.classList.toggle('nav-open');
    
  });
});


// Sticky 

window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  const scrollPosition = window.pageYOffset;

  if (scrollPosition > 0) {
    header.classList.add('sticky');
    document.body.classList.add('scroll');
  } else {
    header.classList.remove('sticky');
    document.body.classList.remove('scroll');
  }
});

