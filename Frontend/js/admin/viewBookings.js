//viewBookings.js

document.addEventListener('DOMContentLoaded', async function () {
    const authToken = localStorage.getItem('authToken');
    const bookingList = document.getElementById('bookingList');
    const roomFilter = document.getElementById('roomFilter');
    const dateFilter = document.getElementById('dateFilter');
    const filterBtn = document.getElementById('filterBtn');
    const viewAllBtn = document.getElementById('viewAllBtn');

    // Initialize by loading rooms and setting event listeners
    await loadRooms();
    fetchBookings(); 
    
    filterBtn.addEventListener('click', fetchBookings);
    viewAllBtn.addEventListener('click', fetchAllBookings);

    // Load rooms for the room filter dropdown
    async function loadRooms() {
        try {
            const response = await fetch('http://localhost:5000/api/rooms', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!response.ok) throw new Error("Failed to fetch rooms");

            const rooms = await response.json();
            rooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room._id;
                option.textContent = `Room ${room.roomNumber} - ${room.location}`;
                roomFilter.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading rooms:", error);
            roomFilter.innerHTML = '<option value="">Error loading rooms</option>';
        }
    }

    // Fetch and display bookings based on selected filters
    async function fetchBookings() {
        const selectedRoomId = roomFilter.value;
        const selectedDate = dateFilter.value;

        if (!selectedRoomId || !selectedDate) {
            bookingList.innerHTML = '<tr><td colspan="6">Please select both room and date to filter.</td></tr>';
            return;
        }

        try {
            const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
            const response = await fetch(`http://localhost:5000/api/bookings/byRoomAndDate?roomId=${selectedRoomId}&bookingDate=${formattedDate}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!response.ok) throw new Error("Failed to fetch bookings");

            const bookings = await response.json();
            displayBookings(bookings);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            bookingList.innerHTML = '<tr><td colspan="6">Error loading bookings.</td></tr>';
        }
    }

    // Fetch and display all bookings without any filters
    async function fetchAllBookings() {
        try {
            const response = await fetch('http://localhost:5000/api/bookings/all', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!response.ok) throw new Error("Failed to fetch all bookings");

            const bookings = await response.json();
            displayBookings(bookings);
        } catch (error) {
            console.error("Error fetching all bookings:", error);
            bookingList.innerHTML = '<tr><td colspan="6">Error loading all bookings.</td></tr>';
        }
    }

    // Render bookings in the table
    function displayBookings(bookings) {
        bookingList.innerHTML = '';

        if (bookings.length === 0) {
            bookingList.innerHTML = '<tr><td colspan="6">No bookings found.</td></tr>';
            return;
        }

        bookings.forEach((booking, index) => {
            const bookingRef = `#${String(index + 1).padStart(4, '0')}`;
            const user = booking.user?.username || booking.user?.email || "Unknown User";
            const room = booking.room ? `Room ${booking.room.roomNumber} - ${booking.room.location}` : "Unknown Room";
            const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
            const time = booking.timeSlot || "N/A";
            const status = booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "N/A";

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bookingRef}</td>
                <td>${user}</td>
                <td>${room}</td>
                <td>${bookingDate}</td>
                <td>${time}</td>
                <td>${status}</td>
            `;
            bookingList.appendChild(row);
        });
    }
});
