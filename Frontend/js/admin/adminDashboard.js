// adminDashboard.js

// Navigate to specified page
function navigateTo(page) {
    window.location.href = page;
}

// Logout functionality
document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('authToken'); 
    window.location.href = 'index.html'; 
});
