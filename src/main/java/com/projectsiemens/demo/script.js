const selectedRooms = [];

async function getNearbyHotels() {
    const radius = parseFloat(document.getElementById('radius').value);
    const latitude = 40.7128; // Example user latitude
    const longitude = -74.0060; // Example user longitude

    try {
        const response = await fetch(`http://localhost:8083/api/hotels/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
        const hotels = await response.json();

        const hotelList = document.getElementById('hotelList');
        hotelList.innerHTML = '';

        hotels.forEach(hotel => {
            const distance = calculateDistance(latitude, longitude, hotel.latitude, hotel.longitude);
            const hotelInfo = document.createElement('div');
            hotelInfo.innerHTML = `
        <h3>${hotel.name}</h3>
        <p>Distance: ${distance.toFixed(2)} km</p>
        <p>Rooms available:</p>
        <ul>
          ${hotel.rooms.map(room => `<li>${room.type} - $${room.price} <button onclick="selectRoom(${hotel.id}, '${room.type}', ${room.price})">Select</button></li>`).join('')}
        </ul>
        <button onclick="showFeedbackForm(${hotel.id})">Send Feedback</button>
      `;
            hotelList.appendChild(hotelInfo);
        });
    } catch (error) {
        console.error('Error fetching nearby hotels:', error);
    }
}

function showFeedbackForm(hotelId) {
    document.getElementById('feedbackHotelId').value = hotelId;
    document.getElementById('feedbackForm').style.display = 'block';
}
async function submitFeedback() {
    const hotelId = document.getElementById('feedbackHotelId').value;
    const feedback = document.getElementById('hotelFeedback').value;

    try {
        const response = await fetch(`http://localhost:8083/api/hotels/${hotelId}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedback)
        });
        if (response.ok) {
            console.log('Feedback submitted successfully');
            document.getElementById('feedbackForm').style.display = 'none';
        } else {
            console.error('Error submitting feedback');
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
    }
}


function selectRoom(hotelId, roomType, price) {
    const room = { hotelId, roomType, price };
    selectedRooms.push(room);
    updateSelectedRooms();
    document.getElementById('reservationForm').style.display = 'block';
}

function updateSelectedRooms() {
    const roomList = document.getElementById('roomList');
    roomList.innerHTML = '';
    selectedRooms.forEach((room, index) => {
        const roomItem = document.createElement('li');
        roomItem.innerHTML = `${room.roomType} - $${room.price} <button onclick="removeRoom(${index})">Remove</button>`;
        roomList.appendChild(roomItem);
    });
}

function removeRoom(index) {
    selectedRooms.splice(index, 1);
    updateSelectedRooms();
    if (selectedRooms.length === 0) {
        document.getElementById('reservationForm').style.display = 'none';
    }
}

async function makeReservation() {
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    const userId = document.getElementById('userId').value;

    const reservations = selectedRooms.map(room => ({
        hotelId: room.hotelId,
        roomType: room.roomType,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        userId: userId
    }));

    try {
        for (const reservation of reservations) {
            const response = await fetch('http://localhost:8083/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reservation)
            });
            const result = await response.json();
            console.log('Reservation successful:', result);
        }

        // Clear selected rooms and hide the form after successful reservations
        selectedRooms.length = 0;
        updateSelectedRooms();
        document.getElementById('reservationForm').style.display = 'none';
    } catch (error) {
        console.error('Error making reservation:', error);
    }
}
async function getUserReservations() {
    const userId = document.getElementById('viewUserId').value;

    try {
        const response = await fetch(`http://localhost:8083/api/reservations/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const reservations = await response.json();

        const reservationList = document.getElementById('reservationList');
        reservationList.innerHTML = '';

        reservations.forEach(reservation => {
            const checkInDate = new Date(reservation.checkInDate);
            const now = new Date();
            const canCancel = (checkInDate - now) >= (2 * 60 * 60 * 1000); // Check if it's at least 2 hours before check-in

            const reservationItem = document.createElement('div');
            reservationItem.innerHTML = `
        <p>Hotel ID: ${reservation.hotelId}</p>
        <p>Room Type: ${reservation.roomType}</p>
        <p>Check-In Date: ${reservation.checkInDate}</p>
        <p>Check-Out Date: ${reservation.checkOutDate}</p>
        <p>User ID: ${reservation.userId}</p>
        ${canCancel ? `<button onclick="cancelReservation(${reservation.id})">Cancel Reservation</button>` : '<p>Cannot cancel within 2 hours of check-in</p>'}
      `;
            reservationList.appendChild(reservationItem);
        });
    } catch (error) {
        console.error('Error fetching user reservations:', error);
    }
}

async function cancelReservation(reservationId) {
    try {
        const response = await fetch(`http://localhost:8083/api/reservations/${reservationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            console.log('Reservation canceled successfully');
            getUserReservations(); // Refresh the reservation list
        } else {
            console.error('Error canceling reservation');
        }
    } catch (error) {
        console.error('Error canceling reservation:', error);
    }
}


async function cancelReservation(reservationId) {
    try {
        const response = await fetch(`http://localhost:8083/api/reservations/${reservationId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log('Reservation canceled successfully');
            getUserReservations(); // Refresh the reservation list
        } else {
            console.error('Error canceling reservation');
        }
    } catch (error) {
        console.error('Error canceling reservation:', error);
    }
}


async function cancelReservation(reservationId) {
    try {
        const response = await fetch(`http://localhost:8083/api/reservations/${reservationId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log('Reservation canceled successfully');
            getUserReservations(); // Refresh the reservation list
        } else {
            console.error('Error canceling reservation');
        }
    } catch (error) {
        console.error('Error canceling reservation:', error);
    }
}


async function cancelReservation(reservationId) {
    try {
        const response = await fetch(`http://localhost:8083/api/reservations/${reservationId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log('Reservation canceled successfully');
            getUserReservations(); // Refresh the reservation list
        } else {
            console.error('Error canceling reservation');
        }
    } catch (error) {
        console.error('Error canceling reservation:', error);
    }
}

// Function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lat2 - lon2);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}