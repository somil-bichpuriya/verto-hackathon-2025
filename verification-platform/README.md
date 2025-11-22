# VertoFX Verification Platform

A modern, professional B2B verification platform for managing cross-border payment client verifications and document reviews.

## 🚀 Features

### ✅ Authentication System
- **Admin Login & Registration** - Secure access for authorized administrators
- Modern, gradient-based UI with smooth animations
- Form validation and session management

### 📊 Analytics Dashboard
- **Real-time Statistics** - Track clients, pending reviews, approvals, and partners
- **Verification Trends** - Visual charts showing monthly verification statistics
- **Document Status Overview** - Pie charts displaying approval rates
- **Recent Activities** - Live feed of client actions and document submissions

### 👥 Client Management
- **Comprehensive Client List** - View all onboarded clients with detailed information
- **Advanced Search & Filters** - Search by name, email, country, or status
- **Status Tracking** - Monitor approved, pending, and rejected clients
- **Quick Actions** - Direct access to client documents and profiles

### 🤝 Partner Management
- **Partner Directory** - Manage organizations accessing verification data
- **Request Tracking** - Monitor data requests from each partner
- **Status Management** - Track active and pending partners
- **Card-based Layout** - Modern, responsive partner cards

### 📄 Document Review System
- **Document Viewer** - Review uploaded verification documents
- **Approval Workflow** - Approve or reject documents with one click
- **Status Tracking** - Monitor document review progress
- **Document Details** - View metadata, upload dates, and review history
- **Interactive Modals** - Full-screen document review interface

## 🎨 Design Features

- **Modern UI/UX** - Clean, professional design with gradient accents
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Fade-in and slide-in effects for better UX
- **Color-coded Status** - Green (approved), Yellow (pending), Red (rejected)
- **Icon-rich Interface** - Lucide React icons throughout
- **TailwindCSS** - Utility-first CSS for rapid development

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first styling
- **Recharts** - Beautiful, responsive charts
- **Lucide React** - Modern icon library

## 📁 Project Structure

```
verification-platform/
├── src/
│   ├── components/
│   │   └── DashboardLayout.tsx    # Main layout with sidebar
│   ├── pages/
│   │   ├── Login.tsx              # Admin login page
│   │   ├── Register.tsx           # Admin registration
│   │   ├── Dashboard.tsx          # Analytics dashboard
│   │   ├── Clients.tsx            # Client management
│   │   ├── Partners.tsx           # Partner management
│   │   └── Documents.tsx          # Document review system
│   ├── App.tsx                    # Main app with routing
│   ├── main.tsx                   # App entry point
│   └── index.css                  # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🚦 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 🔐 Default Credentials

For demo purposes, use any email and password to login.

**Example:**
- Email: `admin@vertofx.com`
- Password: `password123`

## 📱 Pages Overview

### Login/Register
- Beautiful gradient background with glass-morphism effects
- Form validation
- Responsive design

### Dashboard
- 4 key metrics cards (Clients, Pending Reviews, Approved, Partners)
- Area chart showing verification trends over time
- Pie chart displaying document status distribution
- Recent activities feed with color-coded status indicators

### Clients
- Searchable data table with all client information
- Filter by approval status (All, Approved, Pending, Rejected)
- Quick stats showing counts by status
- One-click access to client documents

### Partners
- Card-based grid layout
- Display partner information and request counts
- Active/Pending status indicators
- Easy-to-scan partner directory

### Documents
- Client header with key information
- Document statistics (Total, Approved, Pending, Rejected)
- List of all documents with metadata
- Full-screen review modal with approve/reject actions
- Document preview area (ready for PDF integration)
- Review notes functionality

## 🎯 Use Cases

1. **Compliance Officers** - Review and approve client verification documents
2. **Admin Staff** - Manage client onboarding and partner relationships
3. **Operations Team** - Monitor verification pipeline and approval rates
4. **Partners** - (Future) Request verified client data for cross-border payments

## 🔄 Future Enhancements

- Real backend API integration
- PDF document viewer integration
- Email notifications for document status changes
- Audit trail for all document reviews
- Advanced reporting and analytics
- Partner API access portal
- Multi-factor authentication
- Role-based access control

## 📄 License

Proprietary - VertoFX Internal Use Only

---

Built with ❤️ for VertoFX Cross-Border Payments
