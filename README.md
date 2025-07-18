# RentifyCause

RentifyCause is a rent management/payment platform tailored for the Indian Red Cross Society. The application allows tenants (shopkeepers) to pay rent online, keep track of their rent payment status month-wise, and download official rent invoices. It is built with a TypeScript-based frontend and backend.

---

## Features

- **User Dashboard:** View user/shop information, contact details, and donation history.
- **Rent Payment:** Pay rent for a selected number of months using integrated payment gateway (Razorpay).
- **Month-wise Status:** Easily track which months have been paid, with color-coded status indicators.
- **Invoice Generation & Download:** Automatically generates a detailed, downloadable PDF rent invoice for each payment, including official society branding and digital signature.
- **Payment History:** See a tabular view of all past rent payments with instant download links for receipts.

---


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


1. **Clone the repository:**
   ```bash
   git clone https://github.com/manasbhalerao23/RentifyCause.git
   ```

2. **Install dependencies for both `FE` (frontend) and `BE` (backend):**
   ```bash
   cd RentifyCause/FE
   npm install
   cd ../BE
   npm install
   ```

3. **Set up environment variables for backend (`BE/.env`):**
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
  

4. **Run backend and frontend servers (from root of the repo):**
   ```bash
   # Start Backend
   cd BE
   npm run dev

   # Start Frontend (in a new terminal)
   cd ../FE
   npm run dev
   ```

---

## Folder Structure

```
RentifyCause/
│
├── BE/         # Backend (Node.js, Express)
├── FE/         # Frontend (React, Vite, TS)
└── README.md   # This file
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---
