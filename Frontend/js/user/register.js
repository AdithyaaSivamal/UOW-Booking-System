//register.js

document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const responseMessage = document.getElementById('responseMessage');
    responseMessage.style.color = "red"; 

    // Client-side password match validation
    if (password !== confirmPassword) {
        responseMessage.textContent = "Passwords do not match.";
        return;
    }

    // API request payload
    const data = {
        email: email,
        username: username,
        password: password
    };

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Registration successful
            responseMessage.textContent = "Registration successful!";
            responseMessage.style.color = "green";
            document.getElementById('registerForm').reset();
        } else {
            // Server-side validation or error response
            responseMessage.textContent = result.message || "Registration failed.";
        }
    } catch (error) {
        console.error("Registration error:", error);
        responseMessage.textContent = "Error connecting to server. Please try again later.";
    }
});
