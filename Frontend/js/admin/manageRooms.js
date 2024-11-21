// manageRooms.js
const authToken = localStorage.getItem('authToken');
const roomList = document.getElementById('roomList');

document.addEventListener('DOMContentLoaded', function () {
    
    fetchRooms();
});

// Fetch and display all rooms
async function fetchRooms() {
    try {
        const response = await fetch('http://localhost:5000/api/rooms', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const rooms = await response.json();
        roomList.innerHTML = ''; 

        for (const room of rooms) {
            const roomItem = document.createElement('div');
            roomItem.classList.add('room-item');
            
            // Set image URL or default if no image exists
            let imageUrl = 'path/to/default-image.jpg';
            if (room.image) {
                const imageResponse = await fetch(`http://localhost:5000/api/rooms/${room._id}/image`);
                const imageData = await imageResponse.json();
                imageUrl = imageData.imageUrl;
            }

            roomItem.innerHTML = `
                <h2>Room ${room.roomNumber}</h2>
                <img src="${imageUrl}" alt="Room Image" class="room-image small-image" onclick="toggleImageSize(event)">
                <p><strong>Location:</strong> ${room.location} <button class="update-btn" onclick="updateRoomFeature('${room._id}', 'location')">Update</button></p>
                <p><strong>Capacity:</strong> ${room.capacity} <button class="update-btn" onclick="updateRoomFeature('${room._id}', 'capacity')">Update</button></p>
                <p><strong>Amenities:</strong> ${room.amenities.join(', ')} <button class="update-btn" onclick="updateRoomFeature('${room._id}', 'amenities')">Update</button></p>
                <p><strong>Availability:</strong> ${room.isAvailable ? 'Available' : 'Unavailable'} <button class="update-btn" onclick="updateRoomFeature('${room._id}', 'isAvailable')">Toggle</button></p>
                <p><strong>Price:</strong> $${room.price} <button class="update-btn" onclick="updateRoomFeature('${room._id}', 'price')">Update</button></p>
                <p><strong>Promotional Code:</strong> ${room.promotionalCode || 'None'} <button class="update-btn" onclick="updateRoomPromoCode('${room._id}')">Update Promo Code</button></p>
                <input type="file" id="imageInput-${room._id}" accept="image/*" style="display:none" onchange="updateRoomImage('${room._id}')">
                <button class="update-btn" onclick="document.getElementById('imageInput-${room._id}').click()">Update Image</button>
                <button class="delete-btn" onclick="deleteRoom('${room._id}')">Delete Room</button>
            `;
            roomList.appendChild(roomItem);
        }
    } catch (error) {
        console.error('Error fetching rooms:', error.message);
    }
}

// Toggle between small and full-size image view
function toggleImageSize(event) {
    event.target.classList.toggle('full-size');
}

// Update room feature such as location, capacity, amenities, availability, or price
async function updateRoomFeature(roomId, field) {
    let newValue;

    if (field === 'isAvailable') {
        newValue = confirm("Toggle room availability? Click 'OK' for Available, 'Cancel' for Unavailable.") ? true : false;
    } else {
        newValue = prompt(`Enter new value for ${field}:`);
        if (!newValue || newValue.trim() === '') return;

        if (field === 'capacity' || field === 'price') {
            newValue = Number(newValue);
            if (isNaN(newValue)) {
                alert("Please enter a valid number.");
                return;
            }
        }
        if (field === 'amenities') {
            newValue = newValue.split(',').map(item => item.trim());
        }
    }

    const updateData = { [field]: newValue };

    try {
        const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            showSuccessBanner("Room updated successfully!");
            fetchRooms();
        } else {
            console.error('Failed to update room:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating room:', error.message);
    }
}

// Update room image
async function updateRoomImage(roomId) {
    const imageInput = document.getElementById(`imageInput-${roomId}`);
    const file = imageInput.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`http://localhost:5000/api/rooms/${roomId}/image`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        if (response.ok) {
            showSuccessBanner("Room image updated successfully!");
            fetchRooms();
        } else {
            console.error('Failed to update image:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating image:', error.message);
    }
}

// Delete a room
async function deleteRoom(roomId) {
    const confirmDelete = confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            alert("Room deleted successfully.");
            fetchRooms();
        } else {
            console.error('Failed to delete room:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting room:', error.message);
    }
}

// Show a success message after updates
function showSuccessBanner(message) {
    const successBanner = document.getElementById('successBanner');
    successBanner.textContent = message;
    successBanner.style.display = 'block';
    setTimeout(() => {
        successBanner.style.display = 'none';
    }, 3000);
}

// Update room promotional code
async function updateRoomPromoCode(roomId) {
    const newPromoCode = prompt("Enter new promotional code:");
    if (!newPromoCode || newPromoCode.trim() === '') return;

    const updateData = { promotionalCode: newPromoCode };

    try {
        const response = await fetch(`http://localhost:5000/api/rooms/${roomId}/promotional-code`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            alert("Promotional code updated successfully.");
            fetchRooms();
        } else {
            console.error('Failed to update promotional code:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating promotional code:', error.message);
    }
}
