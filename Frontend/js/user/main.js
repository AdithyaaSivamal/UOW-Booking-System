// main.js

document.addEventListener('DOMContentLoaded', function () {
    const authToken = localStorage.getItem('authToken');
    const authLinks = document.getElementById('authLinks');
    const userControls = document.getElementById('userControls');
    const roomList = document.getElementById('roomList');
    const loginPopup = document.getElementById('loginPopup');
    const goToLogin = document.getElementById('goToLogin');
    const closePopup = document.getElementById('closePopup');
    let userBookings = [];

    // Display profile/logout options if the user is logged in
    if (authToken) {
        authLinks.style.display = 'none';
        userControls.style.display = 'inline';
        fetchUserBookings(); // Fetch user-specific bookings
    }

    // Logout functionality
    document.getElementById('logoutLink').addEventListener('click', function () {
        localStorage.removeItem('authToken');
        window.location.reload();
    });

    // Fetch bookings associated with the logged-in user
    async function fetchUserBookings() {
        try {
            const response = await fetch(`http://localhost:5000/api/bookings/user`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                userBookings = await response.json();
            }
        } catch (error) {
            console.error("Error fetching user bookings:", error);
        }
    }

    // Fetch and display rooms, with optional availability filter
    async function fetchRooms(availability = "all") {
        //debugging text to show on website this function is being called
        console.log("fetchRooms() called with availability: " + availability);
        try {
            const query = availability === "available" ? "?availability=true" : "";
            const response = await fetch(`http://localhost:5000/api/rooms${query}`);
            const rooms = await response.json();

            roomList.innerHTML = ''; 

            for (const room of rooms) {
                const roomItem = document.createElement('div');
                roomItem.classList.add('room-item');

                // Set image for room, or use default
                let imageUrl = 'images/default-room.jpg';
                if (room.image) {
                    const imageResponse = await fetch(`http://localhost:5000/api/rooms/${room._id}/image`);
                    const imageData = await imageResponse.json();
                    imageUrl = imageData.imageUrl;
                }

                // Determine if the room is already booked by this user
                const isBooked = userBookings.some(booking => booking.room._id === room._id);

                // Display promotional badge if there's a promotional code
                const discountBadge = room.promotionalCode ? `<span class="discount-badge">Discount Available!</span>` : '';

                // Room details and booking button
                roomItem.innerHTML = `
                    <img src="${imageUrl}" alt="Room Image" class="room-image small-image">
                    <div class="room-info">
                        <h2>Room: ${room.roomNumber}</h2>
                        <p>Location: ${room.location}</p>
                        <p>Capacity: ${room.capacity} pax</p>
                        <p>${room.amenities.includes("Wi-Fi") ? "Wi-Fi included" : ""}</p>
                        <p class="room-price">Price: $${room.price}/hour</p>
                    </div>
                    <button class="select-btn ${isBooked ? 'selected' : ''}" data-room-id="${room._id}">
                        ${discountBadge}${isBooked ? 'SELECTED' : 'SELECT'}
                    </button>
                `;

                // Style booked room buttons and disable selection
                const button = roomItem.querySelector('.select-btn');
                if (isBooked) {
                    button.style.backgroundColor = '#28a745';
                    button.style.color = '#fff';
                    button.disabled = true; // Prevent rebooking
                }

                roomList.appendChild(roomItem);
            }

            // Event listeners for booking selection
            document.querySelectorAll('.select-btn:not(.selected)').forEach(button => {
                button.addEventListener('click', function () {
                    const roomId = this.getAttribute('data-room-id');
                    if (authToken) {
                        window.location.href = `viewRoom.html?roomId=${roomId}`;
                    } else {
                        loginPopup.style.display = 'flex';
                    }
                });
            });
        } catch (error) {
            console.error("Error fetching rooms:", error);
            roomList.innerHTML = '<p>Error loading rooms.</p>';
        }
    }

    // Fetch all rooms when the page loads
    fetchRooms();

    // Filter button logic for displaying room availability
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            fetchRooms(this.getAttribute('data-availability'));
        });
    });

    // Popup for login prompt
    goToLogin.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    closePopup.addEventListener('click', () => {
        loginPopup.style.display = 'none';
    });
});
