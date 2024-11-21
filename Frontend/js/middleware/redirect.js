document.addEventListener('DOMContentLoaded', function () {
    const authToken = localStorage.getItem('authToken');

    // Redirect to main page if user is already logged in
    if (authToken) {
        window.location.href = '/Frontend/public/user/main.html';
    }
});
