// Menu Items Data
const menuItems = [
    { name: "Biryani", price: 625 },
    { name: "Burger", price: 300 },
    { name: "Pasta", price: 250 },
    { name: "Salad", price: 400 },
    { name: "Soda", price: 120 }
];

// Tables Data
const tables = [
    { number: 1, reserved: false, reservedBy: "" },
    { number: 2, reserved: false, reservedBy: "" },
    { number: 3, reserved: false, reservedBy: "" },
    { number: 4, reserved: false, reservedBy: "" },
    { number: 5, reserved: false, reservedBy: "" }
];

// Global Variables
let currentUser = null;
let currentRole = null;
let currentOrder = {};
let selectedTable = null;
let orders = [];
let feedback = [];

// Initialize localStorage
function initializeStorage() {
    if (!localStorage.getItem('tables')) {
        localStorage.setItem('tables', JSON.stringify(tables));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('feedback')) {
        localStorage.setItem('feedback', JSON.stringify([]));
    }
    loadDataFromStorage();
}

// Load data from localStorage
function loadDataFromStorage() {
    const storedTables = localStorage.getItem('tables');
    const storedOrders = localStorage.getItem('orders');
    const storedFeedback = localStorage.getItem('feedback');

    if (storedTables) {
        tables.length = 0;
        tables.push(...JSON.parse(storedTables));
    }
    if (storedOrders) {
        orders = JSON.parse(storedOrders);
    }
    if (storedFeedback) {
        feedback = JSON.parse(storedFeedback);
    }
}

// Save data to localStorage
function saveDataToStorage() {
    localStorage.setItem('tables', JSON.stringify(tables));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('feedback', JSON.stringify(feedback));
}

// Handle Login
function handleLogin() {
    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!role || !username || !password) {
        showError('Please fill in all fields');
        return;
    }

    // Admin authentication
    if (role === 'admin') {
        if (username === 'admin' && password === '1234') {
            currentUser = username;
            currentRole = role;
            showAdminDashboard();
            showSuccess('Welcome Admin!');
        } else {
            showError('Incorrect admin credentials!');
        }
    }
    // User authentication (any credentials accepted)
    else if (role === 'user') {
        currentUser = username;
        currentRole = role;
        showUserDashboard();
        showSuccess(`Welcome, ${username}!`);
    } else {
        showError('Invalid role selected');
    }
}

// Show User Dashboard
function showUserDashboard() {
    hideAllSections();
    document.getElementById('userSection').classList.add('active');
    document.getElementById('userGreeting').textContent = currentUser;
    displayTables();
}

// Show Admin Dashboard
function showAdminDashboard() {
    hideAllSections();
    document.getElementById('adminSection').classList.add('active');
    document.getElementById('adminContent').innerHTML = '<p>Select an option above to view information.</p>';
}

// Display tables for reservation
function displayTables() {
    const tablesDisplay = document.getElementById('tablesDisplay');
    tablesDisplay.innerHTML = '';

    tables.forEach(table => {
        const div = document.createElement('div');
        div.className = `table-item ${table.reserved ? 'reserved' : 'available'}`;
        div.innerHTML = `
            <div class="table-number">🪑 Table ${table.number}</div>
            <div class="table-status">${table.reserved ? 'Reserved' : 'Available'}</div>
        `;
        if (!table.reserved) {
            div.style.cursor = 'pointer';
        }
        tablesDisplay.appendChild(div);
    });
}

// Show Reservation Modal
function showReservationModal() {
    const modal = document.getElementById('reservationModal');
    const options = document.getElementById('reservationOptions');
    options.innerHTML = '';

    tables.forEach(table => {
        if (!table.reserved) {
            const div = document.createElement('div');
            div.className = `table-item available`;
            div.style.cursor = 'pointer';
            div.innerHTML = `
                <div class="table-number">🪑 Table ${table.number}</div>
                <div class="table-status">Click to select</div>
            `;
            div.onclick = () => {
                selectedTable = table.number;
                // Update UI to show selection
                document.querySelectorAll('#reservationOptions .table-item').forEach(el => {
                    el.classList.remove('selected');
                });
                div.classList.add('selected');
            };
            options.appendChild(div);
        }
    });

    modal.classList.add('active');
}

// Close Reservation Modal
function closeReservationModal() {
    document.getElementById('reservationModal').classList.remove('active');
}

// Confirm Reservation
function confirmReservation() {
    if (!selectedTable) {
        showError('Please select a table');
        return;
    }

    const table = tables.find(t => t.number === selectedTable);
    if (table) {
        table.reserved = true;
        table.reservedBy = currentUser;
        saveDataToStorage();
        closeReservationModal();
        displayTables();
        showSuccess(`Table ${selectedTable} reserved successfully!`);
        selectedTable = null;
    }
}

// Display Menu
function displayMenu() {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';
    currentOrder = {};

    menuItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <h4>🍽️ ${item.name}</h4>
            <div class="price">Rs ${item.price.toFixed(2)}</div>
            <div class="quantity-control">
                <button onclick="decreaseQuantity(${index})">−</button>
                <input type="number" id="qty-${index}" value="0" min="0" readonly>
                <button onclick="increaseQuantity(${index})">+</button>
            </div>
        `;
        menuGrid.appendChild(div);
    });
}

// Increase Quantity
function increaseQuantity(index) {
    const input = document.getElementById(`qty-${index}`);
    input.value = parseInt(input.value) + 1;
    updateOrder();
}

// Decrease Quantity
function decreaseQuantity(index) {
    const input = document.getElementById(`qty-${index}`);
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
    }
    updateOrder();
}

// Update Order
function updateOrder() {
    currentOrder = {};
    let subtotal = 0;

    menuItems.forEach((item, index) => {
        const qty = parseInt(document.getElementById(`qty-${index}`).value) || 0;
        if (qty > 0) {
            currentOrder[item.name] = { qty, price: item.price };
            subtotal += qty * item.price;
        }
    });

    updateBill(subtotal);
}

// Update Bill
function updateBill(subtotal) {
    const tax = subtotal * 0.05;
    const service = subtotal * 0.10;
    const total = subtotal + tax + service;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('service').textContent = service.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);

    // Display order items
    const orderItemsDiv = document.getElementById('orderItems');
    orderItemsDiv.innerHTML = '';

    Object.entries(currentOrder).forEach(([name, data]) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <span class="item-name">${name} x${data.qty}</span>
            <span>Rs ${(data.qty * data.price).toFixed(2)}</span>
        `;
        orderItemsDiv.appendChild(itemDiv);
    });
}

// Submit Order
function submitOrder() {
    if (Object.keys(currentOrder).length === 0) {
        showError('Please select items to order');
        return;
    }

    const subtotal = Object.values(currentOrder).reduce((sum, item) => sum + (item.qty * item.price), 0);
    const tax = subtotal * 0.05;
    const service = subtotal * 0.10;
    const total = subtotal + tax + service;

    const orderData = {
        username: currentUser,
        items: currentOrder,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        service: service.toFixed(2),
        total: total.toFixed(2),
        timestamp: new Date().toLocaleString()
    };

    orders.push(orderData);
    saveDataToStorage();

    showSuccess('Order placed successfully!');
    
    // Move to feedback
    setTimeout(() => {
        toggleSection('orderSection', 'feedbackSection');
    }, 500);
}

// Submit Feedback
function submitFeedback() {
    const feedbackText = document.getElementById('feedbackText').value;

    if (!feedbackText.trim()) {
        showError('Please enter feedback');
        return;
    }

    const feedbackData = {
        username: currentUser,
        message: feedbackText,
        timestamp: new Date().toLocaleString()
    };

    feedback.push(feedbackData);
    saveDataToStorage();

    showSuccess('Thank you for your feedback!');
    document.getElementById('feedbackText').value = '';

    setTimeout(() => {
        handleLogout();
    }, 1000);
}

// Admin: Show Menu
function showAdminMenu(section) {
    const content = document.getElementById('adminContent');
    content.innerHTML = '';

    if (section === 'menu') {
        content.innerHTML = '<h3>📋 Menu Items</h3>';
        menuItems.forEach(item => {
            content.innerHTML += `
                <div class="admin-item">
                    <strong>${item.name}</strong> - Rs ${item.price.toFixed(2)}
                </div>
            `;
        });
    }
    else if (section === 'tables') {
        content.innerHTML = '<h3>📍 Reserved Tables</h3>';
        const reserved = tables.filter(t => t.reserved);
        if (reserved.length === 0) {
            content.innerHTML += '<p>No tables are reserved.</p>';
        } else {
            reserved.forEach(table => {
                content.innerHTML += `
                    <div class="admin-item">
                        Table ${table.number} - Reserved by <strong>${table.reservedBy}</strong>
                        <button class="btn btn-secondary" style="float: right; margin-top: 5px;" onclick="cancelTableReservation(${table.number})">Cancel</button>
                    </div>
                `;
            });
        }
    }
    else if (section === 'orders') {
        content.innerHTML = '<h3>📦 All Orders</h3>';
        if (orders.length === 0) {
            content.innerHTML += '<p>No orders found.</p>';
        } else {
            orders.forEach((order, index) => {
                const itemsList = Object.entries(order.items)
                    .map(([name, data]) => `${name} x${data.qty}`)
                    .join(', ');
                content.innerHTML += `
                    <div class="admin-item">
                        <strong>Order ${index + 1}</strong><br>
                        User: ${order.username}<br>
                        Items: ${itemsList}<br>
                        Total: Rs ${order.total}<br>
                        Time: ${order.timestamp}
                    </div>
                `;
            });
        }
    }
    else if (section === 'feedback') {
        content.innerHTML = '<h3>💬 Customer Feedback</h3>';
        if (feedback.length === 0) {
            content.innerHTML += '<p>No feedback available.</p>';
        } else {
            feedback.forEach((fb, index) => {
                content.innerHTML += `
                    <div class="admin-item">
                        <strong>${fb.username}</strong> (${fb.timestamp})<br>
                        ${fb.message}
                    </div>
                `;
            });
        }
    }
}

// Cancel Table Reservation (Admin)
function cancelTableReservation(tableNumber) {
    const table = tables.find(t => t.number === tableNumber);
    if (table) {
        table.reserved = false;
        table.reservedBy = "";
        saveDataToStorage();
        showAdminMenu('tables');
        showSuccess(`Table ${tableNumber} reservation cancelled.`);
    }
}

// Toggle Between Sections
function toggleSection(hideSection, showSection) {
    document.getElementById(hideSection).classList.remove('active');
    document.getElementById(showSection).classList.add('active');

    if (showSection === 'orderSection') {
        displayMenu();
    }
}

// Hide All Sections
function hideAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
}

// Handle Logout
function handleLogout() {
    currentUser = null;
    currentRole = null;
    currentOrder = {};
    selectedTable = null;
    hideAllSections();
    document.getElementById('loginSection').classList.add('active');
    document.getElementById('role').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    showSuccess('Logged out successfully!');
}

// Show Success Modal
function showSuccess(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').classList.add('active');
}

// Close Success Modal
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

// Show Error Modal
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.add('active');
}

// Close Error Modal
function closeErrorModal() {
    document.getElementById('errorModal').classList.remove('active');
}

// Close modals on outside click
window.onclick = function(event) {
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    const reservationModal = document.getElementById('reservationModal');

    if (event.target === successModal) {
        successModal.classList.remove('active');
    }
    if (event.target === errorModal) {
        errorModal.classList.remove('active');
    }
    if (event.target === reservationModal) {
        reservationModal.classList.remove('active');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
});
