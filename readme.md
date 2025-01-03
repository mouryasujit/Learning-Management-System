# Learning Management System

## **Important: Enable 3rd Party Cookies**

Please ensure that third-party cookies are enabled in your browser to use all functionalities of this application.

## **Overview**

The Learning Management System (LMS) is a full-stack web application designed for managing and accessing educational content. Built using the MERN stack, the application provides role-based features tailored to instructors and students.

## **Tech Stack**

- **Frontend**: React, Redux Toolkit (RTK), RTK Query, TypeScript, ShadCN UI, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **Payment Integration**: Stripe Webhooks

## **Key Features**

### 1. **Authentication**

- Secure user authentication using bcrypt for password hashing and JWT for token-based authorization.

### 2. **Protected Routes**

- Frontend routes are protected to ensure only authorized users can access certain pages.

### 3. **User Roles**

- **Instructor**:
  - Manage lectures: Perform Create, Read, Update, and Delete (CRUD) operations.
  - Upload videos for lectures.
  - View dashboard with insights on courses sold.
- **Student**:
  - Purchase courses through an integrated payment gateway.
  - Access purchased courses and view their content.

### 4. **Payment Integration**

- Stripe Webhooks are used to handle course purchases securely and efficiently.

### 5. **RTK Query**

- Used for efficient caching and API calls, improving data fetching and state management.

## **Setup Instructions**

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB database set up.
- Stripe account for payment integration.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/lms.git
   cd lms
   ```
2. Install dependencies for both backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```
3. Configure environment variables:

   - Create a `.env` file in the `backend` directory with the following:

     ```env
     MONGO_URI=<your_mongodb_uri>
     JWT_SECRET=<your_jwt_secret>
     STRIPE_SECRET=<your_stripe_secret>
     CLOUDINARY_SECRET_KEY=
     CLODINARY_CLOUD_NAME
     STRIPE_PUBLISHABLE_KEY
     STRIPE_SECRET_KEY
     WEBHOOK_ENDPOINT_KEY-<get this from stripe webiste>

     ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
2. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`.

## **Folder Structure**

```
LMS/
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.ts
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── store/
│   │   └── App.tsx
├── README.md
```

## **Future Improvements**

- Add a notification system for new courses and lectures.
- Implement advanced analytics for instructors.
- Enhance UI with additional themes and animations.

## **License**

---

Auther - Sujitkumar Mourya
