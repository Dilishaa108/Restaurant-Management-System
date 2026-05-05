# 🍽️ Restaurant Management System - Web Version

A fully functional **web-based restaurant management system** with user and admin interfaces. This is a conversion of the original C++ console application into an interactive, responsive web application.

## ✨ Features

### 👤 User Features
- **Table Reservation** - Reserve available tables with a visual interface
- **Menu Browsing** - View all menu items with prices
- **Order Management** - Select items and quantities with real-time bill calculation
- **Billing** - Automatic tax (5%) and service charge (10%) calculation
- **Feedback System** - Submit feedback after ordering
- **Data Persistence** - All orders and reservations saved using browser storage

### 🔐 Admin Features
- **View Menu** - Display all available menu items
- **Manage Reservations** - View reserved tables and cancel reservations
- **View Orders** - See all customer orders with details
- **View Feedback** - Read customer feedback

## 🎯 Menu Items

| Item | Price |
|------|-------|
| Biryani | Rs 625 |
| Burger | Rs 300 |
| Pasta | Rs 250 |
| Salad | Rs 400 |
| Soda | Rs 120 |

## 🔓 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| 👤 User | Any | Any |
| 🔐 Admin | admin | 1234 |

## 🛠️ Technology Stack

- **HTML5** - Structure
- **CSS3** - Responsive Design (Mobile, Tablet, Desktop)
- **JavaScript (Vanilla)** - All Logic & Interactivity
- **LocalStorage** - Data Persistence

## 📱 Responsive Design

The application is fully responsive and works beautifully on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1200px+)

## 🌐 Live Demo

Visit the live demo here:
👉 **[Restaurant Management System Live Demo](https://Dilishaa108.github.io/Restaurant-Management-System/)**

## 🚀 Quick Start

### Option 1: View Live (Recommended)
Simply visit the live link above to see the application in action!

### Option 2: Run Locally
1. Clone the repository:
```bash
git clone https://github.com/Dilishaa108/Restaurant-Management-System.git
cd Restaurant-Management-System
```

2. Open `index.html` in your web browser
3. The application will load and be ready to use!

## 📂 Project Structure

```
Restaurant-Management-System/
├── index.html      # Main HTML file with structure
├── style.css       # Styling and responsive design
├── script.js       # All JavaScript logic
└── README.md       # This file
```

## 💾 Data Storage

The application uses **browser LocalStorage** to persist:
- Table reservations
- Customer orders
- Customer feedback

Data is automatically saved when:
- A table is reserved/cancelled
- An order is placed
- Feedback is submitted

## 🎨 UI Features

- **Gradient Background** - Beautiful purple/blue gradient
- **Smooth Animations** - Fade-in effects and transitions
- **Interactive Elements** - Hover effects on buttons and cards
- **Modal Dialogs** - Success, error, and confirmation messages
- **Real-time Updates** - Bill calculation updates as you select items
- **Visual Feedback** - Clear status indicators for tables (Available/Reserved)

## 🔄 User Flow

### User Journey
1. Login (any username/password)
2. See available tables
3. Optionally reserve a table
4. Browse menu and select items
5. View bill with automatic calculations
6. Place order
7. Submit feedback
8. Logout

### Admin Journey
1. Login with `admin`/`1234`
2. Access admin dashboard
3. View menu, reservations, orders, and feedback
4. Manage table reservations (cancel if needed)
5. Logout

## 📊 Billing Calculation

```
Subtotal = Sum of all items selected
Tax (5%) = Subtotal × 0.05
Service Charge (10%) = Subtotal × 0.10
Total = Subtotal + Tax + Service Charge
```

## 🌟 Original C++ Version

The original C++ console application is also available in this repository for reference.

## 📝 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

**Dilisha Sapkota**
- GitHub: [@Dilishaa108](https://github.com/Dilishaa108)

---

## 📞 Support

If you encounter any issues or have suggestions:
1. Create an issue on GitHub
2. Check existing issues for solutions

---

**Enjoy managing your restaurant! 🍽️✨**
