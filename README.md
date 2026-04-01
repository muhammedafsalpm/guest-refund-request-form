# Guest Refund Request Form

A production-ready web application for property management companies to handle guest refund requests.

## 🚀 Features

- ✅ **Complete Form** - 6 fields with validation
- ✅ **Conditional Logic** - 90-day warning banner
- ✅ **File Upload** - Support for images and PDFs
- ✅ **Data Persistence** - MongoDB database storage
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Success Summary** - Download/Print/Email options
- ✅ **Auto Ticket Numbers** - Unique REF-YYYYMMDD-XXXX format

## 📋 Requirements

- Node.js 18+ 
- MongoDB Atlas account (free tier)
- Vercel account (for deployment)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/refund-request-form-mongodb.git
cd refund-request-form-mongodb
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MongoDB Atlas

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create database user and password
4. Add IP whitelist (0.0.0.0/0 for production)
5. Get connection string

### 4. Configure environment variables

Create `.env.local`:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/refund_requests
MONGODB_DB=refund_requests
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment to Vercel

1. Push code to GitHub
2. Import repository to Vercel
3. Add environment variables
4. Deploy

## 📁 Project Structure

```
refund-request-form-mongodb/
├── app/
│   ├── api/
│   │   ├── submit/route.js    # Form submission API
│   │   └── upload/route.js    # File upload API
│   ├── layout.js               # Root layout
│   └── page.js                 # Main form
├── components/
│   ├── FileUpload.jsx          # File upload component
│   ├── SuccessSummary.jsx      # Success page
│   └── WarningBanner.jsx       # Warning banner
├── lib/
│   ├── mongodb.js              # Database connection
│   ├── validation.js           # Form validation
│   └── dateUtils.js            # Date utilities
├── models/
│   └── RefundRequest.js        # Data model
└── public/
    └── uploads/                # Uploaded files
```

## 🔧 API Endpoints

### POST /api/submit
Submit refund request
- Body: `{ fullName, email, bookingReference, bookingDate, refundReason, additionalDetails, evidenceUrl }`
- Response: `{ success, data: { ticketNumber, ... } }`

### POST /api/upload
Upload evidence file
- FormData: `{ file }`
- Response: `{ success, url }`

### GET /api/submit
View submissions (admin only)
- Header: `Authorization: Bearer {token}`

## 📊 Database Schema

```javascript
{
  ticketNumber: String (unique),
  fullName: String,
  email: String,
  bookingReference: String,
  bookingDate: Date,
  refundReason: String,
  additionalDetails: String,
  evidenceUrl: String,
  status: String (pending/approved/denied),
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

```bash
# Run tests (coming soon)
npm test
```

## 📝 License

MIT

## 🤝 Support

For issues or questions, contact support@example.com

## 🌟 Live Demo

[View Live Application](https://your-vercel-url.vercel.app)