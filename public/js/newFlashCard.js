document.addEventListener("DOMContentLoaded", () => {
const addExampleBtn = document.querySelector('#addExampleBtn');
const exampleFieldsContainer = document.querySelector('#exampleFieldsContainer');
const exampleFieldTemplate = exampleFieldsContainer.firstElementChild;

addExampleBtn.addEventListener('click', () => {
  // To clone the example field
  const exampleField = exampleFieldTemplate.cloneNode(true);

  // To clear the input values in the cloned field
  const inputFields = exampleField.querySelectorAll('input[type="text"], input[type="file"]');
  inputFields.forEach((input) => {
    input.value = '';
  });

  // To append the cloned field to the example fields container
  exampleFieldsContainer.appendChild(exampleField);
})
});