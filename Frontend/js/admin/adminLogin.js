// adminLogin.js

document.getElementById('adminLoginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission default behavior

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const responseMessage = document.getElementById('responseMessage');

    // Data for API request
    const data = {
        username,
        password
    };

    try {
        // Send login request to the API
        const response = await fetch('http://localhost:5000/api/auth/admin-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.isAdmin) {
            // Save token and redirect to admin dashboard
            localStorage.setItem('authToken', result.token);
            window.location.href = 'adminDashboard.html';
        } else {
            // Display error for non-admin users or failed login
            responseMessage.textContent = result.message || "Login failed.";
            responseMessage.style.color = "red";
        }
    } catch (error) {
        responseMessage.textContent = "Error connecting to server.";
        responseMessage.style.color = "red";
    }
});
