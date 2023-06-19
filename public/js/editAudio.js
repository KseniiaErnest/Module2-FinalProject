document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.querySelector('#upload-new-audio');
  const uploadLink = document.querySelector('#upload-audio-link');

  // fileInput.style.visibility = 'hidden';

  uploadLink.addEventListener('click', (e) => {
    e.preventDefault();

    fileInput.style.visibility = 'visible'; 
  })


});

