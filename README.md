# 🏥 Pharmacy Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A professional, responsive, and feature-rich Pharmacy Management Dashboard designed for pharmacists to manage inventory, track sales, and monitor pharmacy performance with ease.

[**✨ Live Demo**](https://your-github-username.github.io/Anthor_v/dashboard/index.html)

---

## 📸 Project Preview

> [!TIP]
> **Protip:** Add your own screenshots to the `assets/images/` folder and link them here to make your portfolio stand out!

| Dashboard View | Inventory Management | Sale Interface |
| :---: | :---: | :---: |
| ![Dashboard](https://via.placeholder.com/800x450?text=Dashboard+Preview) | ![Inventory](https://via.placeholder.com/800x450?text=Inventory+Management) | ![Sales](https://via.placeholder.com/800x450?text=Sales+Interface) |

---

## 🚀 Key Features

- **📊 Dynamic Dashboard**: Real-time sales statistics, medicine counts, and performance charts using Chart.js.
- **📦 Inventory Management**: full CRUD functionality (Create, Read, Update, Delete) for medications.
- **🔍 Smart Search**: Advanced searching by drug name or manufacturer (Company).
- **🛒 Sales Tracking**: Integrated sales logging with Today/Weekly/Monthly summaries.
- **📱 Ultra Responsive**: Fully optimized for Desktop, Tablet, and Mobile devices with a professional sliding sidebar.
- **📅 Expiry Alerts**: Visual indicators and dedicated sections for identifying expired or low-stock medications.
- **🔒 Secure Access**: Simplified login system with persistent session management.
- **📂 Bulk Import**: Capability to import drug data from external datasets (`JSON`).

---

## 🛠️ Tech Stack

- **Frontend**: Standard HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Charts**: [Chart.js](https://www.chartjs.org/) for data visualization.
- **Alerts**: [SweetAlert2](https://sweetalert2.github.io/) for beautiful, responsive popups.
- **Icons**: [Font Awesome 6](https://fontawesome.com/) for a modern UI.
- **Persistence**: LocalStorage for local data management without a backend.

---

## 📂 Project Structure

```text
Anthor_v/
├── assets/
│   ├── data/
│   │   └── drugs_data.json   # External drug dataset (Ignored in Git)
│   └── images/               # Project images and assets
├── dashboard/
│   ├── index.html            # Main Dashboard UI
│   ├── script.js             # Core business logic
│   └── style.css             # Dashboard styling
├── login/
│   ├── index.html            # Login page UI
│   ├── script.js             # Authentication logic
│   └── style.css             # Login styling
├── .gitignore                # Privacy settings (Dataset hidden)
└── README.md                 # Project documentation
```

---

---

## 🔐 Dataset & Privacy

This project supports integration with large external drug datasets (e.g. JSON / CSV) to enable features like:

- Auto-complete while adding medications
- Bulk import of selected drugs into the system

⚠️ **Important Note**  
The original drug dataset used during development is **NOT included** in this repository.

### Why is the dataset excluded?
- The dataset is large in size
- It may contain licensed or paid data
- To prevent unauthorized redistribution or resale

For this reason, the dataset file is added to `.gitignore` and intentionally hidden.

### How to use your own dataset
You can use **any compatible JSON dataset** by placing it inside:
assets/data/

And ensuring it follows a structure similar to:

```json
{
  "drugs": [
    {
      "tradename": "Drug Name",
      "company": "Manufacturer",
      "new_price": "Price",
      "group": "Optional Category"
    }
  ]
}
```
---

## 📥 Getting Started

### Prerequisites
A modern web browser (Chrome, Firefox, Safari, Edge).

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-github-username/Anthor_v.git
   ```
2. **Navigate to the project**:
   ```bash
   cd Anthor_v
   ```
3. **Run the application**:
   Simply open `login/index.html` in your favorite browser.

---

## ☁️ Deployment

This project is perfectly suited for **GitHub Pages**:

1. Push your code to a GitHub repository.
2. Go to **Settings** > **Pages**.
3. Select the `main` branch as your source.
4. Your site will be live at `https://<your-username>.github.io/Anthor_v/`.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🤝 Contact

**Project Lead** - [Ahmed Hamdy]
- **LinkedIn**: [https://www.linkedin.com/in/ahmed-hamdy-881b1826a/]
- **Email**: [syda90215@gmail.com]

---
*Developed with ❤️ for the pharmaceutical community.*

