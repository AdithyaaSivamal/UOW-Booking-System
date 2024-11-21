//profile.js

document.addEventListener('DOMContentLoaded', function () {
    const authToken = localStorage.getItem('authToken');
    fetchBookingHistory(authToken);
});

// Fetch and display booking history
async function fetchBookingHistory(authToken) {
    const bookingList = document.getElementById('bookingList');
    try {
        const response = await fetch('http://localhost:5000/api/bookings/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) throw new Error("Failed to fetch booking history");

        const bookings = await response.json();
        displayBookings(bookings);
    } catch (error) {
        console.error("Error fetching booking history:", error);
        bookingList.innerHTML = '<tr><td colspan="6">Error loading booking history. Please try again later.</td></tr>';
    }
}

// Render bookings in the table
function displayBookings(bookings) {
    const bookingList = document.getElementById('bookingList');
    bookingList.innerHTML = ''; // Clear existing entries

    bookings.forEach((booking, index) => {
        const bookingRef = `#${String(index + 1).padStart(4, '0')}`;
        const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
        const location = booking.room ? booking.room.location : 'Room deleted';
        const time = booking.timeSlot || 'N/A';
        const status = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

        // Assign status class for styling
        const statusClass = status === 'Booked' ? 'status-booked' : status === 'Canceled' ? 'status-canceled' : '';

        // Show "Cancel" button only if booking is not canceled
        const cancelButton = status !== 'Canceled'
            ? `<button class="cancel-btn" onclick="cancelBooking('${booking._id}')">Cancel?</button>`
            : '';

        // Append booking row to the table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bookingRef}</td>
            <td>${bookingDate}</td>
            <td>${location}</td>
            <td>${time}</td>
            <td class="${statusClass}">${status}</td>
            <td>${cancelButton}</td>
        `;
        bookingList.appendChild(row);
    });
}

// Cancel a booking
async function cancelBooking(bookingId) {
    const authToken = localStorage.getItem('authToken');
    const confirmCancel = confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            alert("Booking canceled successfully.");
            fetchBookingHistory(authToken); // Refresh booking history after cancellation
        } else {
            alert("Failed to cancel booking. Please try again.");
        }
    } catch (error) {
        console.error("Error canceling booking:", error);
        alert("An error occurred while canceling the booking. Please try again later.");
    }
}
