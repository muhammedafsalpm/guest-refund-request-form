# Deluxe Stays Guest Refund Request Form

A production-ready web application for property management companies to handle guest refund requests. This application features a premium user interface with glassmorphism design, smooth micro-animations, and robust data management.

## 🚀 Features

- ✅ **Complete Form** - 6 fields with validation
- ✅ **Premium UI/UX** - Modern design elements including glassmorphism and refined typography
- ✅ **Conditional Logic** - 90-day warning banner
- ✅ **File Upload** - Support for images and PDFs
- ✅ **Data Persistence** - Supabase integration with local JSON file fallback
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Success Summary** - Download/Print/Email options
- ✅ **Auto Ticket Numbers** - Unique REF-YYYYMMDD-XXXX format

## 📋 Requirements

- Node.js 18+
- Supabase account (free tier) for database storage
- Vercel account (for deployment)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/deluxe-stays-refund-form.git
cd refund-request-form-mongodb
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create an account at [Supabase](https://supabase.com)
2. Create a new project
3. Access your project settings -> API to get your URL and anon key
4. Create a table named `refund_requests` with appropriate columns based on the Database Schema below or use the SQL Editor to run your setup script.

### 4. Configure environment variables

Create `.env.local`:

```bash
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Deluxe Stays"
```
*(Note: If Supabase connection fails or is omitted, the application will gracefully fall back to saving data locally in `data/submissions.json`.)*

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
│   │   ├── submit/route.js    # Form submission API (Supabase/Local)
│   │   └── upload/route.js    # File upload API
│   ├── layout.js              # Root layout
│   └── page.js                # Main form UI
├── components/
│   ├── FileUpload.jsx         # File upload component
│   ├── SuccessSummary.jsx     # Success page
│   └── WarningBanner.jsx      # Warning banner
├── data/
│   └── submissions.json       # Local fallback database
├── lib/
│   ├── supabase.js            # Supabase connection
│   ├── db.js                  # Legacy Mongoose connection (if still in use)
│   ├── validation.js          # Form validation
│   └── dateUtils.js           # Date utilities
├── models/
│   └── RefundRequest.js       # Legacy Mongoose data model
└── public/
    └── uploads/               # Uploaded files
```

## 🔧 API Endpoints

### POST /api/submit
Submit refund request
- Body: `{ fullName, email, bookingReference, bookingDate, refundReason, additionalDetails, evidenceUrl }`
- Response: `{ success, data: { ticketNumber, dbStatus, ... } }`

### POST /api/upload
Upload evidence file
- FormData: `{ file }`
- Response: `{ success, url }`

### GET /api/submit
View submissions
- Returns a combined array of Supabase and local JSON fallback submissions.

## 📊 Database Schema (Supabase)

The `refund_requests` table should include:

- `id` (uuid, primary key)
- `ticket_number` (text, unique)
- `full_name` (text)
- `email` (text)
- `booking_reference` (text)
- `booking_date` (date)
- `refund_reason` (text)
- `additional_details` (text, nullable)
- `evidence_url` (text, nullable)
- `status` (text, default 'pending')
- `created_at` (timestamp with time zone)

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