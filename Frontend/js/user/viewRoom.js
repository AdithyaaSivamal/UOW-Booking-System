//viewRoom.js

document.addEventListener('DOMContentLoaded', async function () {
    const roomId = new URLSearchParams(window.location.search).get('roomId');
    const authToken = localStorage.getItem('authToken');
    const roomDetailsContainer = document.getElementById('roomDetails');
    const bookingDateInput = document.getElementById('bookingDate');
    const timeSlotsContainer = document.getElementById('timeSlots');
    const confirmBookingBtn = document.getElementById('confirmBooking');
    const paywall = document.getElementById('paywall');
    const payNowBtn = document.getElementById('payNowBtn');
    const successBanner = document.getElementById('successBanner');
    let selectedTimeSlot = null;

    // Set minimum booking date to today
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;

    // Predefined available time slots
    const availableSlots = [
        "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
        "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"
    ];

    // Fetch and display room details
    async function fetchRoomDetails() {
        try {
            const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`);
            if (!response.ok) throw new Error("Failed to fetch room details");

            const room = await response.json();
            roomDetailsContainer.innerHTML = `
                <div class="room-info">
                    <h2>Room: ${room.roomNumber}</h2>
                    <p>Location: ${room.location}</p>
                    <p>Capacity: ${room.capacity} pax</p>
                    <p>Price: $${room.price}/hour</p>
                    <p>Amenities: ${room.amenities.join(", ")}</p>
                </div>
            `;
        } catch (error) {
            console.error("Error fetching room details:", error);
            roomDetailsContainer.innerHTML = '<p>Error loading room details.</p>';
        }
    }

    // Fetch booked slots for a specific date
    async function fetchBookingsForDate(date) {
        try {
            const response = await fetch(`http://localhost:5000/api/bookings?roomId=${roomId}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!response.ok) throw new Error("Failed to fetch bookings");

            const bookings = await response.json();
            return bookings
                .filter(booking => new Date(booking.bookingDate).toISOString().split('T')[0] === date && booking.status === 'booked')
                .map(booking => booking.timeSlot); 
        } catch (error) {
            console.error("Error fetching bookings:", error);
            return [];
        }
    }

    // Render time slots with unavailable ones disabled
    async function renderTimeSlots(date) {
        timeSlotsContainer.innerHTML = ''; 
        const bookedSlots = await fetchBookingsForDate(date);

        availableSlots.forEach(slot => {
            const slotBtn = document.createElement('button');
            slotBtn.classList.add('time-slot');
            slotBtn.textContent = slot;
            slotBtn.classList.remove('unavailable', 'selected');
            slotBtn.disabled = false;

            // Disable the slot if booked on the selected date
            if (bookedSlots.includes(slot)) {
                slotBtn.classList.add('unavailable');
                slotBtn.disabled = true;
            } else {
                slotBtn.addEventListener('click', () => selectTimeSlot(slot));
            }

            timeSlotsContainer.appendChild(slotBtn);
        });
    }

    // Highlight selected time slot
    function selectTimeSlot(slot) {
        selectedTimeSlot = slot;
        Array.from(timeSlotsContainer.children).forEach(btn => btn.classList.remove('selected'));
        const selectedBtn = Array.from(timeSlotsContainer.children).find(btn => btn.textContent === slot);
        selectedBtn.classList.add('selected');
    }

    // Show paywall when "Confirm Booking" is clicked
    confirmBookingBtn.addEventListener('click', function () {
        if (!selectedTimeSlot) {
            alert("Please select a time slot.");
            return;
        }
        paywall.style.display = 'flex';
    });

    // Complete "payment" and proceed with booking
    payNowBtn.addEventListener('click', async function () {
        paywall.style.display = 'none';
        const bookingDate = new Date(bookingDateInput.value).toISOString();

        try {
            const response = await fetch('http://localhost:5000/api/bookings/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    roomId: roomId,
                    bookingDate: bookingDate,
                    timeSlot: selectedTimeSlot
                })
            });

            if (response.ok) {
                successBanner.style.display = 'block';
                setTimeout(() => { window.location.href = 'index.html'; }, 2000); 
            } else {
                console.error("Failed to book room:", response.statusText);
            }
        } catch (error) {
            console.error("Error booking room:", error);
        }
    });

    // Handle date changes to fetch available slots
    bookingDateInput.addEventListener('change', function () {
        renderTimeSlots(bookingDateInput.value);
    });

    // Fetch room details and render initial slots
    await fetchRoomDetails();
    renderTimeSlots(today);
});
