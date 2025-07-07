# RentifyCause

RentifyCause is a rent management/payment platform tailored for the Indian Red Cross Society, Chhatarpur (M.P.). The application allows tenants (shopkeepers) to pay rent online, keep track of their rent payment status month-wise, and download official rent invoices. It is built with a TypeScript-based frontend and backend.

---

## Features

- **User Dashboard:** View user/shop information, contact details, and donation history.
- **Rent Payment:** Pay rent for a selected number of months using integrated payment gateway (Razorpay).
- **Month-wise Status:** Easily track which months have been paid, with color-coded status indicators.
- **Invoice Generation & Download:** Automatically generates a detailed, downloadable PDF rent invoice for each payment, including official society branding and digital signature.
- **Payment History:** See a tabular view of all past rent payments with instant download links for receipts.

---

## Architecture Flow

```mermaid
graph TD
    A[User (Tenant/Shopkeeper)] -->|Login/Authenticate| B[Frontend (React + Redux)]
    B --> |REST API Calls| C[Backend (Node.js + Express)]
    C --> |Authenticate & Authorize| D[JWT Auth Service]
    C --> |Create Payment Order| E[Payment Gateway (Razorpay)]
    E --> |Callback (Payment Success/Fail)| C
    C --> |Generate Invoice PDF| F[PDF Generation Service (pdf-lib)]
    F --> |Store Invoice| G[Cloudinary (Cloud Storage)]
    C --> |Update Payment & Rent Status| H[Database]
    B --> |Fetch Rent Status, Payment History, Invoice URLs| C
    B --> |Download Invoice| G
```

**Flow Explanation:**
1. **Login:** User logs in and is authenticated via JWT.
2. **Dashboard:** User views their shop details, rent status, and payment history.
3. **Rent Payment:** User selects months and initiates a payment via Razorpay.
4. **Payment Callback:** After successful payment, the backend generates a PDF invoice and uploads it to Cloudinary.
5. **Record Keeping:** Backend updates the database with payment status and stores the invoice URL.
6. **Invoice Access:** User can view/download invoices from their dashboard.

---

## Technologies Used

- **Frontend:** React, Redux, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Payment Gateway:** Razorpay
- **PDF Generation:** pdf-lib
- **Cloud Storage:** Cloudinary
- **Authentication:** JWT

---

## Getting Started

> _Please update these steps with your actual repo structure and setup instructions!_

1. Clone the repository:
   ```bash
   git clone https://github.com/manasbhalerao23/RentifyCause.git
   ```
2. Install dependencies for both `FE` (frontend) and `BE` (backend).
3. Set up environment variables for backend (e.g., payment gateway keys, JWT secret, Cloudinary credentials).
4. Run backend and frontend servers.

---
