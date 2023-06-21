// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event


// document.addEventListener("DOMContentLoaded", () => {
//   console.log("Module2-FinalProject JS imported successfully!");
// });

// const header = document.querySelector('#header');
// const sticky = header.offsetTop;
// function handleScroll() {
//   if (window.pageYOffset >= sticky) {
//     header.classList.add('sticky');
//   } else {
//     header.classList.remove('sticky');
//   }
// };

// window.addEventListener('scroll', handleScroll);


// Mobile navigation
document.addEventListener('DOMContentLoaded', function(e) {
  e.preventDefault();
  const btnNav = document.querySelector('.btn-mobile-nav');
  const header = document.querySelector('.header');
  
  btnNav.addEventListener('click', function() {
    header.classList.toggle('nav-open');
  });
});


// Sticky 

const section = document.querySelector('.margin-top-body');
const navbar = document.querySelector('.header');
const obs = new IntersectionObserver(function(entries){
  const ent = entries[0];

  if (ent.isIntersecting === false) {
    navbar.classList.remove('sticky');
  } else {
    navbar.classList.add('sticky');
  }
}, {
  root: null,
  threshold: 0,
  rootMargin: '-80px',
})
obs.observe(section);
