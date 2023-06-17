// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("Module2-FinalProject JS imported successfully!");
});

const header = document.querySelector('#header');
const sticky = header.offsetTop;
function handleScroll() {
  if (window.pageYOffset >= sticky) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
};

window.addEventListener('scroll', handleScroll);
