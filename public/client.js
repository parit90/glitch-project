
// client-side js
// run by the browser each time your view template is loaded

console.log('hello world :o');

// define variables that reference elements on our page
const santaForm = document.querySelector('#santa-form');

santaForm.addEventListener('submit', submitHandler);

function submitHandler(event) {
      event.preventDefault();
      
      const userId = document.querySelector('#user-id').value;
      const message = document.querySelector('#message').value;
      
      fetch('/user', {
        method: 'POST',
        body: JSON.stringify({ userId, message }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
            const formContainer = document.querySelector('#santa-form');
            formContainer.style.display = 'none';
            
            const errorMessage = document.createElement('p');
            errorMessage.innerText = data.error;
            const errorDiv = document.querySelector('#error-message');
            errorDiv.innerHTML = '';
            errorDiv.appendChild(errorMessage);
        } else {
            const formContainer = document.querySelector('#santa-form');
            formContainer.style.display = 'none';
            const successMessage = document.createElement('p');
            successMessage.innerText = "request has been received, you will receive an email";
            const successDiv = document.querySelector('#success-message');
            successDiv.innerHTML = '';
            successDiv.appendChild(successMessage);
        }
      })
      .catch(error => {
        // Display error message to the user
      });
    }
    