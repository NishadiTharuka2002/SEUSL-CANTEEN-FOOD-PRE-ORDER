# University Canteen Pre-order & Queue Management System
**South Eastern University of Sri Lanka (SEUSL)**  
**Course:** SWT22022 Practical for Internet Application Development  
**Group:** Group U  
**Project Title:** University canteen pre order and Queue management System  

---

## 👥 Individual Contribution Breakdown (Modules & Files)

### 📌 Member 01: W.H.N Tharuka (`SEU/IS/22/ICT/097`)
**Assigned Module:** Module 1 – Menu & Inventory Management  
**Key Tasks:** Create food items, prices and categories, manage ingredients & stock, mark items unavailable.  
- **Backend Model:** `backend/models/MenuItem.js`
- **Backend Model:** `backend/models/Inventory.js`
- **Backend Controller:** `backend/controllers/menuInventoryController.js`
- **Backend Routes:** `backend/routes/menuInventoryRoutes.js`
- **Frontend Page:** `frontend/src/pages/member1/MenuBrowsing.jsx`
- **Frontend Page:** `frontend/src/pages/member1/InventoryManagement.jsx`

---

### 📌 Member 02: W.G.G.U Weerasiri (`SEU/IS/22/ICT/062`)
**Assigned Module:** Module 2 – Shopping Cart & Pre-Order Management  
**Key Tasks:** Cart functions, price calculations, manage pickup slots and place pre-orders (avoid crowds).  
- **Backend Model:** `backend/models/PickupSlot.js`
- **Backend Controller:** `backend/controllers/orderController.js`
- **Backend Routes:** `backend/routes/orderRoutes.js`
- **Frontend Context:** `frontend/src/context/CartContext.jsx`
- **Frontend Page:** `frontend/src/pages/member2/CartView.jsx`
- **Frontend Page:** `frontend/src/pages/member2/CheckoutSlotBooking.jsx`

---

### 📌 Member 03: A.M.S Rasanjalie (`SEU/IS/22/ICT/079`)
**Assigned Module:** Module 3 – Status & Queue Management  
**Key Tasks:** Order status transitions (`Placed` -> `Confirmed` -> `Preparing` -> `Ready` -> `Collected`), kitchen preparation queue, real-time Socket.io updates, order cancellation & refund triggers.  
- **Backend Model (Co-op):** `backend/models/Order.js`
- **Backend Realtime Socket:** `backend/socket/socketHandler.js`
- **Backend Controller:** `backend/controllers/queueController.js`
- **Backend Routes:** `backend/routes/queueRoutes.js`
- **Frontend Page:** `frontend/src/pages/member3/StudentOrderTracking.jsx`
- **Frontend Page:** `frontend/src/pages/member3/KitchenQueueBoard.jsx`

---

### 📌 Member 04: P.G.N.B Gamage (`SEU/IS/22/ICT/101`)
**Assigned Module:** Module 4 – Payment & Transaction Management  
**Key Tasks:** Digital student wallet, mock top-up payment gateway, wallet deductions, refund management on cancellation, transaction ledger.  
- **Backend Model:** `backend/models/Wallet.js`
- **Backend Model:** `backend/models/Transaction.js`
- **Backend Controller:** `backend/controllers/walletController.js`
- **Backend Routes:** `backend/routes/walletRoutes.js`
- **Frontend Page:** `frontend/src/pages/member4/WalletTransactions.jsx`

---

### 📌 Member 05: K.G.C.S Thilakarathna (`SEU/IS/22/ICT/107`)
**Assigned Module:** Module 5 – Analytics & Admin Dashboard  
**Key Tasks:** Sales reports, popular item reports, peak-hour crowd analysis, customer feedback & star ratings.  
- **Backend Model:** `backend/models/Feedback.js`
- **Backend Controller:** `backend/controllers/analyticsFeedbackController.js`
- **Backend Routes:** `backend/routes/analyticsFeedbackRoutes.js`
- **Frontend Page:** `frontend/src/pages/member5/AdminAnalyticsDashboard.jsx`
- **Frontend Page:** `frontend/src/pages/member5/FeedbackReviewPage.jsx`

---

## 🚀 How to Run the Application

### 1. Backend Setup:
```bash
cd backend
npm install
npm run seed     # Pre-populates sample data for all 5 modules!
npm run dev      # Starts API server on http://localhost:5000
```

### 2. Frontend Setup:
```bash
cd frontend
npm install
npm run dev      # Starts React client on http://localhost:5173
```

### 3. Demo Credentials:
- **Student:** `student@seusl.lk` | Password: `password123` (Initial Wallet Balance: Rs. 2,500)
- **Canteen Staff:** `staff@seusl.lk` | Password: `password123`
- **Kitchen Chef:** `kitchen@seusl.lk` | Password: `password123`
- **Admin:** `admin@seusl.lk` | Password: `password123`
