// login.js

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const responseMessage = document.getElementById('responseMessage');


    const data = {
        username,
        password
    };

    try {
        // Send login request to the server
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Store the token and redirect to the main page
            localStorage.setItem('authToken', result.token);
            responseMessage.textContent = "";
            window.location.href = '/frontend/public/main.html'; 
        } else {
            // Display error message on login failure
            responseMessage.textContent = result.message || "Login failed.";
            responseMessage.style.color = "red";
        }
    } catch (error) {
        // Handle server connection errors
        console.error('Error during login:', error);
        responseMessage.textContent = "Error connecting to server.";
        responseMessage.style.color = "red";
    }
});
