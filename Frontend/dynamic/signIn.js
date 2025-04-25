document.getElementById('admin-checkbox').addEventListener('change', function () {
    const secretKeyGroup = document.getElementById('secret-key-group');
    
    // Toggle visibility based on checkbox state
    if (this.checked) {
      secretKeyGroup.style.display = 'block';
    } else {
      secretKeyGroup.style.display = 'none';
    }
  });


  function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message; // Set the error message text
    errorDiv.style.display = 'block'; // Make it visible
  }
  
  document.querySelector('form').addEventListener('submit', function (event) {
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('pass').value;
    const adminCheckbox = document.getElementById('admin-checkbox').checked;
    const secretKey = document.getElementById('secret-key').value.trim();
    let Valid = true;
  
    if (email === '') {
      displayError('Email is required!');
      Valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      displayError('Please enter a valid email address.');
      Valid=false;
    }
  
    // Password Validation
    if (password === '') {
      displayError('Password is required!');
      Valid = false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

    if (!passwordRegex.test(password)) {
        displayError('Password must include uppercase, lowercase, special, & 8+ characters.');
        Valid = false;
    }
    // Confirm Password Validation
    if (confirmPassword === '') {
      displayError('Confirm Password is required!');
      Valid = false;
    } else if (password !== confirmPassword) {
      displayError('Passwords do not match!');
      Valid = false;
    }
    if (adminCheckbox) {
        if (secretKey === '') {
          displayError('Secret Key is required for Admin Accounts!');
          Valid = false;
        } else if (secretKey.toLowerCase() != 'say my name') {
          displayError('Secret Key invalid.');
          Valid = false;
        }
      }
    if(!Valid)
    {
        event.preventDefault();
    }
  });