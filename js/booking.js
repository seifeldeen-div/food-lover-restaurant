// Booking Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;

    // Booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBooking);
    }

    // Set minimum date (today)
    const bookingDate = document.getElementById('bookingDate');
    if (bookingDate) {
        const today = new Date().toISOString().split('T')[0];
        bookingDate.setAttribute('min', today);
        
        // Set maximum date (7 days from today)
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        bookingDate.setAttribute('max', maxDate.toISOString().split('T')[0]);
    }

    // Load bookings
    loadBookings();
});

// Handle booking form submission
function handleBooking(e) {
    e.preventDefault();
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const bookingDate = document.getElementById('bookingDate').value;
    const bookingTime = document.getElementById('bookingTime').value;
    const guests = parseInt(document.getElementById('guests').value);
    const tableType = document.getElementById('tableType').value;
    const specialRequests = document.getElementById('specialRequests').value;

    // Validate date
    const selectedDate = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('لا يمكن الحجز في تاريخ سابق!');
        return;
    }

    // Create booking
    const booking = {
        id: Date.now().toString(),
        userId: currentUser.id,
        date: bookingDate,
        time: bookingTime,
        guests: guests,
        tableType: tableType,
        specialRequests: specialRequests,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // Save booking
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Show success message
    alert('✓ Table booked successfully!');
    
    // Reset form
    document.getElementById('bookingForm').reset();
    
    // Reload bookings
    loadBookings();
    
    // Scroll to bookings section
    setTimeout(() => {
        document.getElementById('myBookings').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// Load bookings
function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    if (!bookingsList) return;

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const bookings = getBookings();
    const userBookings = bookings.filter(booking => booking.userId === currentUser.id).reverse();

    if (userBookings.length === 0) {
        bookingsList.innerHTML = '<p class="empty-bookings">No previous bookings</p>';
        return;
    }

    bookingsList.innerHTML = userBookings.map(booking => createBookingCard(booking)).join('');
    
    // Attach cancel listeners
    attachCancelListeners();
}

// Create booking card
function createBookingCard(booking) {
    const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
    const statusText = getBookingStatusText(booking.status);
    
    return `
        <div class="booking-card">
            <div class="booking-header">
                <div>
                    <span class="booking-id">Booking #${booking.id.slice(-6)}</span>
                </div>
                <div class="booking-date-time">
                    <span><i class="fa-solid fa-calendar"></i> ${formatDate(booking.date)}</span>
                    <span><i class="fa-solid fa-clock"></i> ${booking.time}</span>
                </div>
            </div>
            <div class="booking-details">
                <div class="booking-detail-item">
                    <i class="fa-solid fa-users"></i>
                    <span>${booking.guests} guests</span>
                </div>
                <div class="booking-detail-item">
                    <i class="fa-solid fa-chair"></i>
                    <span>${getTableTypeText(booking.tableType)}</span>
                </div>
                <div class="booking-detail-item">
                    <i class="fa-solid fa-info-circle"></i>
                    <span class="booking-status ${booking.status}">${statusText}</span>
                </div>
            </div>
            ${booking.specialRequests ? `
                <div class="booking-requests">
                    <strong>Special Requests:</strong>
                    <p>${booking.specialRequests}</p>
                </div>
            ` : ''}
            ${canCancel ? `
                <button class="btn-cancel-booking" onclick="cancelBooking('${booking.id}')">
                    <i class="fa-solid fa-times"></i> Cancel Booking
                </button>
            ` : ''}
        </div>
    `;
}

// Attach cancel listeners
function attachCancelListeners() {
    // Already handled by onclick in HTML
}

// Cancel booking
function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    const bookings = getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    
    if (booking) {
        booking.status = 'cancelled';
        localStorage.setItem('bookings', JSON.stringify(bookings));
        loadBookings();
        alert('✓ Booking cancelled');
    }
}

// Get bookings from localStorage
function getBookings() {
    const bookingsStr = localStorage.getItem('bookings');
    return bookingsStr ? JSON.parse(bookingsStr) : [];
}

// Get booking status text
function getBookingStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'cancelled': 'Cancelled',
        'completed': 'Completed'
    };
    return statusMap[status] || status;
}

// Get table type text
function getTableTypeText(type) {
    const typeMap = {
        'standard': 'Standard (2-4 guests)',
        'large': 'Large (5-8 guests)',
        'vip': 'VIP (9+ guests)'
    };
    return typeMap[type] || type;
}
