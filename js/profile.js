// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;

    // Load user data
    loadUserProfile();
    loadUserStats();
});

// Load user profile data
function loadUserProfile() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Display user info
    document.getElementById('userName').textContent = currentUser.fullName;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('displayEmail').textContent = currentUser.email;
    document.getElementById('displayPhone').textContent = currentUser.phone || '-';
    
    // Format register date
    if (currentUser.registerDate) {
        const date = new Date(currentUser.registerDate);
        document.getElementById('registerDate').textContent = formatDate(currentUser.registerDate);
    }
}

// Load user statistics
function loadUserStats() {
    // Load orders count
    const orders = getOrders();
    const userOrders = orders.filter(order => order.userId === getCurrentUser().id);
    document.getElementById('ordersCount').textContent = `${userOrders.length} orders`;

    // Load bookings count
    const bookings = getBookings();
    const userBookings = bookings.filter(booking => booking.userId === getCurrentUser().id);
    document.getElementById('bookingsCount').textContent = `${userBookings.length} bookings`;

    // Load favorites count
    const favorites = getFavorites();
    document.getElementById('favoritesCount').textContent = `${favorites.length} items`;
}

// Get orders from localStorage
function getOrders() {
    const ordersStr = localStorage.getItem('orders');
    return ordersStr ? JSON.parse(ordersStr) : [];
}

// Get bookings from localStorage
function getBookings() {
    const bookingsStr = localStorage.getItem('bookings');
    return bookingsStr ? JSON.parse(bookingsStr) : [];
}

// Get favorites from localStorage
function getFavorites() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    const favoritesStr = localStorage.getItem(`favorites_${currentUser.id}`);
    return favoritesStr ? JSON.parse(favoritesStr) : [];
}
