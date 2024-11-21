// createRoom.js

document.getElementById('createRoomForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const authToken = localStorage.getItem('authToken');
    const roomName = document.getElementById('roomName').value;
    const capacity = document.getElementById('capacity').value;
    const location = document.getElementById('location').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('imageFile').files[0];
    const successBanner = document.getElementById('successBanner');
    const responseMessage = document.getElementById('responseMessage');

    // Setup form data with required fields
    const formData = new FormData();
    formData.append('roomNumber', roomName);
    formData.append('capacity', capacity);
    formData.append('location', location);
    formData.append('price', price);
    formData.append('amenities', description);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        // Send POST request to create a room
        const response = await fetch('http://localhost:5000/api/rooms', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        if (response.ok) {
            // Show success banner and reset form
            successBanner.style.display = 'block';
            document.getElementById('createRoomForm').reset();
            responseMessage.textContent = "Room created successfully!";
            responseMessage.style.color = "green";
        } else {
            const error = await response.json();
            console.error('Failed to create room:', error.message);
            responseMessage.textContent = error.message || "Failed to create room.";
            responseMessage.style.color = "red";
        }
    } catch (error) {
        console.error('Error creating room:', error);
        responseMessage.textContent = "An error occurred while creating the room.";
        responseMessage.style.color = "red";
    }
});
