document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.imgInput').style.visibility = 'hidden';
  
  document.querySelector('.uploadNewImg').onclick = function(e) {
    e.preventDefault();

    document.querySelector('.imgInput').style.visibility = 'visible';
    e.currentTarget.style.visibility = 'hidden';
  }
});