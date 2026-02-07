// Products Page JavaScript

// Products data
const productsData = [
    { id: 1, name: 'Lasal cheese', price: 118, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', image: 'img/food1.png', category: 'lunch' },
    { id: 2, name: 'Jumbo crab shrimp', price: 155, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', image: 'img/food2.png', category: 'dinner' },
    { id: 3, name: 'Koktail juise', price: 105, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', image: 'img/food3.png', category: 'dessert' },
    { id: 4, name: 'Capo Steck', price: 300, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', image: 'img/food4.png', category: 'dinner' },
    { id: 5, name: 'Organic fruit salad', price: 30, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', image: 'img/food5.png', category: 'breakfast' },
    { id: 6, name: 'Cheese pizza', price: 15, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', image: 'img/food6.png', category: 'lunch' },
    { id: 7, name: 'Kofta Meat', price: 12, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', image: 'img/food7.jpeg', category: 'dinner' },
    { id: 8, name: 'Spanish pies', price: 60, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', image: 'img/food8.jpeg', category: 'breakfast' },
    { id: 9, name: 'Cheese tost', price: 100, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', image: 'img/food9.jpeg', category: 'breakfast' },
    { id: 10, name: 'Fruite salad', price: 150, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', image: 'img/food1.png', category: 'dessert' },
    { id: 11, name: 'Chicken shawerma', price: 120, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', image: 'img/food5.png', category: 'lunch' },
    { id: 12, name: 'Mega Cheese pizza', price: 40, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', image: 'img/food6.png', category: 'lunch' }
];

let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;

    // Load products
    loadProducts();

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            loadProducts();
        });
    });

    // Load cart
    loadCart();

    // Load orders
    loadOrders();
});

// Load products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const filteredProducts = currentCategory === 'all' 
        ? productsData 
        : productsData.filter(p => p.category === currentCategory);

    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    // Add event listeners
    attachProductListeners();
}

// Create product card
function createProductCard(product) {
    const favorites = getFavorites();
    const isFavorite = favorites.includes(product.id);
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-header">
                    <h3 class="product-name">${product.name}</h3>
                    <span class="product-price">${product.price} EGP</span>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn-favorite ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${product.id})">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Attach product listeners
function attachProductListeners() {
    // Already handled by onclick in HTML
}

// Add to cart
function addToCart(productId) {
    if (!checkAuth()) {
        window.location.href = 'login.html';
        return;
    }
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    loadCart();
    
    // Show notification
    showNotification('Product added to cart!', 'success');
}

// Make functions available globally
window.addToCart = addToCart;

// Toggle favorite
function toggleFavorite(productId) {
    if (!checkAuth()) {
        window.location.href = 'login.html';
        return;
    }
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const favorites = getFavorites();
    const index = favorites.indexOf(productId);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(productId);
    }

    localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(favorites));
    loadProducts();
}

window.toggleFavorite = toggleFavorite;

// Get favorites
function getFavorites() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    const favoritesStr = localStorage.getItem(`favorites_${currentUser.id}`);
    return favoritesStr ? JSON.parse(favoritesStr) : [];
}

// Load cart
function loadCart() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Cart is empty</p>';
        updateCartSummary(0);
        return;
    }

    cartItems.innerHTML = cart.map(item => createCartItem(item)).join('');
    
    // Attach cart item listeners
    attachCartListeners();
    updateCartSummary();
}

// Create cart item
function createCartItem(item) {
    return `
        <div class="cart-item" data-item-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">${item.price} ج.م</p>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">
                        <i class="fa-solid fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Attach cart listeners
function attachCartListeners() {
    // Already handled by onclick in HTML
}

// Increase quantity
function increaseQuantity(productId) {
    if (!checkAuth()) return;
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += 1;
        saveCart(cart);
        loadCart();
    }
}

window.increaseQuantity = increaseQuantity;

// Decrease quantity
function decreaseQuantity(productId) {
    if (!checkAuth()) return;
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCart(cart);
        loadCart();
    }
}

window.decreaseQuantity = decreaseQuantity;

// Remove from cart
function removeFromCart(productId) {
    if (!checkAuth()) return;
    const cart = getCart();
    const newCart = cart.filter(item => item.id !== productId);
    saveCart(newCart);
    loadCart();
    showNotification('Product removed from cart', 'info');
}

window.removeFromCart = removeFromCart;

// Update cart summary
function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.14;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('total').textContent = formatCurrency(total);

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.onclick = function() {
        if (cart.length === 0) {
            showNotification('Cart is empty!', 'error');
            return;
        }
        checkout();
        };
    }
}

// Checkout
function checkout() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const cart = getCart();
    if (cart.length === 0) return;

    // Create order
    const order = {
        id: Date.now().toString(),
        userId: currentUser.id,
        items: cart.map(item => ({ ...item })),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        tax: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.14,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.14,
        date: new Date().toISOString(),
        status: 'pending'
    };

    // Save order
    const orders = getOrders();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    saveCart([]);
    loadCart();

    showNotification('Order completed successfully!', 'success');
    setTimeout(() => {
        loadOrders();
        window.location.hash = 'orders';
    }, 1000);
}

// Load orders
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const orders = getOrders();
    const userOrders = orders.filter(order => order.userId === currentUser.id).reverse();

    if (userOrders.length === 0) {
        ordersList.innerHTML = '<p class="empty-orders">No previous orders</p>';
        return;
    }

    ordersList.innerHTML = userOrders.map(order => createOrderCard(order)).join('');
}

// Create order card
function createOrderCard(order) {
    return `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <span class="order-id">Order #${order.id.slice(-6)}</span>
                    <span class="order-date">${formatDate(order.date)}</span>
                </div>
                <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>${item.price * item.quantity} EGP</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Total: ${formatCurrency(order.total)} EGP
            </div>
        </div>
    `;
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

// Get orders
function getOrders() {
    const ordersStr = localStorage.getItem('orders');
    return ordersStr ? JSON.parse(ordersStr) : [];
}

// Show notification
function showNotification(message, type) {
    // Simple alert for now, can be enhanced with toast notifications
    if (type === 'success') {
        alert('✓ ' + message);
    } else if (type === 'error') {
        alert('✗ ' + message);
    } else {
        alert(message);
    }
}
