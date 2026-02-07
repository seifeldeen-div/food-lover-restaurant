// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Set minimum date for booking (today)
    const bookingDate = document.getElementById('bookingDate');
    if (bookingDate) {
        const today = new Date().toISOString().split('T')[0];
        bookingDate.setAttribute('min', today);
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        bookingDate.setAttribute('max', maxDate.toISOString().split('T')[0]);
    }
});

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Get users from localStorage
    const users = getUsers();
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Show success and redirect
        showMessage('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1000);
    } else {
        showMessage('Invalid email or password', 'error');
    }
}

// Handle register
function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Validation
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    // Get users from localStorage
    const users = getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showMessage('This email is already registered', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        fullName,
        email,
        phone,
        password,
        registerDate: new Date().toISOString()
    };

    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    showMessage('Account created successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1500);
}

// Get users from localStorage
function getUsers() {
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
}

// Show message
function showMessage(message, type) {
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    if (type === 'error' && errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        if (successMessage) successMessage.classList.remove('show');
        
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    } else if (type === 'success' && successMessage) {
        successMessage.textContent = message;
        successMessage.classList.add('show');
        if (errorMessage) errorMessage.classList.remove('show');
    }
}
