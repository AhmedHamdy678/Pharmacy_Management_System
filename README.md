# 💊 Pharmacy Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chart.js&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-Design-green)

A modern, feature-rich **Pharmacy Management System** built with vanilla JavaScript, HTML5, and CSS3. This system provides comprehensive medication management, inventory tracking, sales analytics, and real-time dashboard visualizations for pharmacy operations.

---

## 🌟 Live Demo

> **Live Demo:** [View Live Project](https://pharmacy-management-sysytem.netlify.app/)  


---

## 📋 Overview

The **Pharmacy Management System** is a complete web-based solution designed to streamline pharmacy operations. It offers an intuitive dashboard for managing medications, tracking inventory levels, monitoring sales, and generating insightful analytics through interactive charts. The system features a responsive design that works seamlessly across all devices, from desktops to mobile phones.

### Key Highlights
- **🎯 Complete CRUD Operations** - Add, edit, delete, and search medications with ease
- **📊 Real-time Analytics** - Visual charts and statistics powered by Chart.js
- **📱 Fully Responsive** - Optimized for all screen sizes and devices
- **💾 Local Data Persistence** - All data stored securely in browser localStorage
- **⚡ Fast & Lightweight** - Pure vanilla JavaScript with no heavy frameworks
- **🔍 Smart Search** - Drug name autocomplete with external dataset integration
- **⚠️ Intelligent Alerts** - Automated notifications for expired and low-stock items

---

## ✨ Features

### 🏠 Dashboard
- **Statistics Cards**: Display key metrics including total medications, missing items, expired medications, and total sales
- **Sales by Category Chart**: Visualize sales distribution across different medication categories
- **Top-Selling Medications**: Bar chart showing the most popular products
- **Interactive Elements**: Click on stats cards to navigate to detailed views

### 💊 Medication Management
- **Complete CRUD Operations**: Create, read, update, and delete medication records
- **Smart Autocomplete**: Drug name suggestions from external dataset (when available)
- **Image Upload**: Support for product images with preview functionality
- **Automatic Calculations**: Dynamic price calculations with discount support
- **Duplicate Detection**: Intelligent merging of existing medications based on name, company, and expiry date
- **Expiry Date Validation**: Warnings for adding expired medications

### 🛍️ Product Display & Sales
- **Product Cards View**: Visual card-based layout for browsing medications
- **Category Filtering**: Quick filters for antibiotics, painkillers, medical supplies, chronic medications, supplements, and ointments
- **Real-time Search**: Search by product name or barcode
- **Quantity Tracking**: Display aggregated quantities for grouped products
- **One-Click Sales**: Quick sell functionality directly from product cards or tables

### 📦 Inventory Management
- **Expiry Alerts**: Automatic detection and highlighting of expired medications
- **Low Stock Warnings**: Notifications for medications below minimum quantity thresholds
- **Missing Items Tracking**: Dedicated section for out-of-stock medications
- **Visual Indicators**: Color-coded alerts for different inventory statuses

### 💰 Sales Tracking
- **Sales History**: Comprehensive table of all transactions with timestamps
- **Period-Based Analytics**: View sales for today, this week, and this month
- **Sales Records Management**: Individual and bulk deletion of sales records
- **Revenue Calculations**: Automatic total sales calculations across all periods
- **Purchase Tracking**: Each sale deducts inventory automatically

### 🔍 Search & Filter
- **Dual Search Modes**: Search by medication name or manufacturing company
- **Live Search**: Real-time filtering as you type
- **Category Filters**: Filter products by medication category
- **Combined Search**: Apply both category filters and search simultaneously

### 📊 Data Visualization
- **Interactive Charts**: Powered by Chart.js for smooth animations
- **Dynamic Updates**: Charts update automatically as data changes
- **Category Breakdown**: Pie chart showing sales distribution
- **Performance Metrics**: Bar charts for top-performing products

---

## 🚀 Tech Stack

### Frontend Technologies
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)** - Vanilla JavaScript for all functionality

### Libraries & Tools
- **[Chart.js](https://www.chartjs.org/)** - Interactive and responsive charts
- **[SweetAlert2](https://sweetalert2.github.io/)** - Beautiful, responsive alert dialogs
- **[Font Awesome 6](https://fontawesome.com/)** - Icon toolkit for UI elements
- **[Google Fonts (Cairo)](https://fonts.google.com/specimen/Cairo)** - Arabic and Latin typography

### Data Storage
- **localStorage** - Client-side data persistence for medications and sales
- **JSON** - Data format for external drug dataset *(Note: Dataset not included in repository)*

---

## 📁 Project Structure

```
Pharmacy_Management_System-main/
│
├── index.html              # Main application file
├── style.css               # Comprehensive styling (1,249 lines)
├── script.js               # Core JavaScript logic (1,516 lines)
├── script.js_snippet.js    # Additional code snippets
│
├── assets/
│   ├── data/
│   │   └── drugs_data.json # External drug dataset (NOT INCLUDED)
│   └── images/             # Product images and assets
│
├── .gitignore              # Git ignore rules (excludes dataset)
└── README.md               # Project documentation (this file)
```

### File Descriptions

| File | Description | Lines |
|------|-------------|-------|
| `index.html` | Main HTML structure with all sections and UI components | 252 |
| `style.css` | Complete styling with CSS variables, responsive design, and animations | 1,249 |
| `script.js` | All JavaScript functionality including CRUD operations, charts, and data management | 1,516 |
| `script.js_snippet.js` | Additional helper functions and code snippets | 3,526 chars |

---

## 🎯 Usage

### Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/Pharmacy_Management_System.git
   cd Pharmacy_Management_System-main
   ```

2. **Open in Browser**
   ```bash
   # Simply open index.html in your preferred browser
   # Or use a local server (recommended)
   npx serve .
   # or
   python -m http.server 8000
   ```

3. **Access the Application**
   - Open `http://localhost:8000` in your browser
   - The dashboard will load with default empty state
   - Start adding medications to populate the system

### Adding Medications

1. Navigate to **"إدارة الأدوية"** (Medication Management) section
2. Fill in the medication details:
   - **Name**: Start typing to see autocomplete suggestions *(requires dataset)*
   - **Company**: Manufacturing company name
   - **Image**: Upload product image (optional)
   - **Price**: Original price
   - **Discount**: Discount amount
   - **Quantity**: Available stock
   - **Expiry Date**: Product expiration date
3. Click **"إضافة دواء"** (Add Medication) to save
4. View the medication in the table below

### Managing Inventory

1. Visit **"إدارة المخزون"** (Inventory Management)
2. Check for:
   - **Expired Medications**: Highlighted in red with expiry dates
   - **Low Stock Items**: Items below minimum quantity
3. Take action on flagged items

### Making Sales

**From Medication Table:**
1. Locate the medication in the medications table
2. Click the **"بيع"** (Sell) button
3. Inventory automatically decrements
4. Sale is recorded with timestamp

**From Product Display:**
1. Navigate to **"عرض الادوية"** (Product Display)
2. Browse or filter products by category
3. Click on products to view details
4. *(Note: Direct selling from cards requires implementation)*

### Viewing Analytics

1. Go to **"لوحة التحكم"** (Dashboard)
2. View statistics cards for quick metrics
3. Analyze charts:
   - **Sales by Category**: See which categories perform best
   - **Top-Selling Medications**: Identify best-sellers
4. Click on stats cards for detailed views

### Searching & Filtering

**In Medication Management:**
1. Use the search bar at the top
2. Select search mode: By Name or By Company
3. Results filter in real-time

**In Product Display:**
1. Click category filter buttons to narrow down products
2. Use search bar for specific medications or barcodes
3. Combine filters and search for precise results

---

## 📱 Responsive Design

The system is fully responsive and optimized for:

- **🖥️ Desktop** (1920px+) - Full sidebar, expanded tables, and charts
- **💻 Laptop** (1024px - 1919px) - Optimized grid layouts
- **📱 Tablet** (768px - 1023px) - Collapsible sidebar with overlay
- **📱 Mobile** (320px - 767px) - Mobile-first navigation, stacked layouts

### Mobile Features
- **Hamburger Menu**: Toggleable sidebar with overlay
- **Touch-Optimized**: Larger tap targets and swipe-friendly interfaces
- **Responsive Tables**: Horizontal scrolling for wide data tables
- **Adaptive Charts**: Charts resize fluidly based on viewport

---

## ⚠️ Important Notes

### Dataset Availability
> **⚠️ IMPORTANT**: The external drug dataset (`assets/data/drugs_data.json`) is **NOT included** in this repository for privacy and licensing reasons.

The system includes a data import feature that references an external JSON file containing:
- Drug trade names
- Manufacturing companies  
- Pricing information
- Additional metadata

**The application remains fully functional without this dataset**, with the following limitations:
- Autocomplete suggestions will not work
- Manual entry required for all medication details
- Import from external data feature will not function

**To use the autocomplete feature**, you would need to:
1. Obtain a licensed drug database in JSON format
2. Structure it as: `{ "drugs": [{ "tradename": "...", "company": "...", "new_price": "..." }] }`
3. Place it at `assets/data/drugs_data.json`
4. Remove `drugs_data.json` from `.gitignore` if you want to commit it

---

## 🔧 Deployment

### GitHub Pages

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select `main` branch and `/root` folder
   - Save and wait for deployment

3. **Access Your Site**
   - URL: `https://github.com/AhmedHamdy678/Pharmacy_Management_System/`

### Netlify / Vercel

1. **Drag and Drop**
   - Simply drag the project folder to Netlify/Vercel dashboard
   - Automatic deployment with live URL

2. **CLI Deployment**
   ```bash
   # Netlify
   npm install -g netlify-cli
   netlify deploy --prod
   
   # Vercel
   npm install -g vercel
   vercel --prod
   ```

### Traditional Web Hosting

1. Upload all files to your web server via FTP
2. Ensure `index.html` is in the root directory
3. Access via your domain name

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit Changes**
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. **Push to Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Ideas
- Add user authentication system
- Implement print functionality for invoices
- Create PDF export for reports
- Add barcode scanning support
- Integrate with backend API
- Multi-language support (English, French, etc.)
- Dark mode theme toggle
- Advanced analytics and reporting

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 [Ahmed Hamdy]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Contact 011155 61531

**Developer:** [Ahmed Hamdy]

- **GitHub:** (https://github.com/AhmedHamdy678/)
- **Email:** syda90215@gmail.com
- **LinkedIn:** (https://www.linkedin.com/in/ahmed-hamdy-881b1826a/)
- **Portfolio:** [yourportfolio.com](https://yourportfolio.com)

---

## 🙏 Acknowledgments

- **[Chart.js Team](https://www.chartjs.org/)** - For the excellent charting library
- **[SweetAlert2](https://sweetalert2.github.io/)** - For beautiful alert dialogs
- **[Font Awesome](https://fontawesome.com/)** - For comprehensive icon library
- **Open Source Community** - For inspiration and resources

---

## 📸 Screenshots

### Dashboard Overview
*Clean and intuitive dashboard with real-time statistics and charts*

### Medication Management
*Comprehensive CRUD interface with smart autocomplete and validation*

### Product Display
*Visual card-based layout with category filters and search*

### Inventory Alerts
*Real-time notifications for expired and low-stock items*

### Sales Analytics
*Detailed sales tracking with period-based summaries*

---

## 🔮 Future Enhancements

- [ ] Backend integration with Node.js/Express
- [ ] Database support (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] Multi-user support with role-based access
- [ ] Invoice generation and printing
- [ ] Email notifications for low stock
- [ ] Barcode scanner integration
- [ ] Advanced reporting and analytics
- [ ] Export data to CSV/Excel
- [ ] Multi-language support
- [ ] PWA (Progressive Web App) support
- [ ] Dark mode theme
- [ ] Supplier management module
- [ ] Customer prescription tracking

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Ahmed Hamdy]

</div>

