# ScanQR

A modern QR code scanner app built with React Native and Expo, featuring real-time scanning, location tracking, and cloud data synchronization.

## ✨ Features

- 📱 **Multi-format scanning**: QR codes, Code128, DataMatrix, Aztec, EAN13
- 📍 **Real-time location**: GPS coordinates display with permission handling
- 💾 **Dual storage**: Local SQLite + Remote MySQL via REST API
- 🔄 **Camera controls**: Front/back camera switching with smooth transitions
- 📋 **Quick actions**: One-tap copy to clipboard functionality
- 🌐 **Cloud sync**: Automatic data persistence through web service
- 🎨 **Modern UI**: Dark theme with smooth animations and micro-interactions
- 📱 **Cross-platform**: iOS, Android, and Web support

## 🛠 Tech Stack

### Frontend
- **React Native** with Expo SDK 53
- **Expo Router** for navigation
- **TypeScript** for type safety
- **expo-camera** for scanning functionality
- **expo-location** for GPS tracking
- **expo-sqlite** for local storage

### Backend
- **Node.js** with Express.js
- **MySQL** database with Knex.js ORM
- **CORS** enabled for cross-origin requests
- **RESTful API** design

## 📁 Project Structure

```
ScanQR/
├── app/
│   └── index.tsx              # Main scanner interface
├── src/
│   ├── models.ts              # TypeScript interfaces
│   └── webservice.ts          # API client with axios
├── WebService/                # Backend API server
│   ├── app.js                # Express server setup
│   ├── model/
│   │   ├── _database.js      # Database connection
│   │   └── codigos.js        # Codes model
│   ├── routes/
│   │   └── codigos.js        # API endpoints
│   └── database.sql          # Database schema
├── assets/                   # App icons and splash screens
└── app.json                  # Expo configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- MySQL 8.0+
- Mobile device or emulator for testing

### Backend Setup

1. **Database Configuration**:
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE scanqr CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE USER 'usuarioqr'@'localhost' IDENTIFIED BY '123';
GRANT ALL PRIVILEGES ON scanqr.* TO 'usuarioqr'@'localhost';
FLUSH PRIVILEGES;
```

2. **Install backend dependencies**:
```bash
cd WebService
npm install
```

3. **Initialize database schema**:
```bash
mysql -u usuarioqr -p123 scanqr < database.sql
```

4. **Start the API server**:
```bash
npm start
# Server runs on http://localhost:3000
```

### Frontend Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure API endpoint**:
   - Open `src/webservice.ts`
   - Update `hostApi` with your machine's IP address:
   ```typescript
   const hostApi = 'http://YOUR_IP_ADDRESS:3000';
   ```
   - For local development, find your IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

3. **Start Expo development server**:
```bash
npm start
```

4. **Run on device**:
   - Scan QR code with Expo Go app, or
   - Press `i` for iOS simulator, or
   - Press `a` for Android emulator

## 📱 Usage Guide

### First Launch
1. **Grant permissions**: Camera and location access when prompted
2. **Position camera**: Point at any supported barcode/QR code
3. **Automatic scanning**: Codes are detected and saved instantly

### Interface Features
- **Scan frame**: Visual guide for optimal positioning
- **Location display**: Real-time GPS coordinates in header
- **History panel**: Scrollable list of all scanned codes
- **Copy function**: Tap any code to copy to clipboard
- **Camera flip**: Toggle between front/rear cameras

### Supported Formats
- QR Code
- Code 128
- Data Matrix
- Aztec Code
- EAN-13

## 🔌 API Reference

### Base URL
```
http://localhost:3000
```

### Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/codigos` | Get all codes | `?nc=type` (filter by type) |
| `GET` | `/codigos/:id` | Get specific code | `id` (numeric) |
| `POST` | `/codigos` | Create new code | `{data, type}` in body |
| `PUT` | `/codigos/:id` | Update code | `id` + `{data, type}` |
| `DELETE` | `/codigos/:id` | Delete code | `id` (numeric) |

### Example Requests

```javascript
// Create a new scanned code
POST /codigos
Content-Type: application/json

{
  "data": "https://example.com",
  "type": "qr"
}

// Response: 201 Created
{
  "id": 123
}
Location: http://localhost:3000/codigos/123
```

## 🏗 Development

### Architecture Overview

The app follows a clean architecture pattern:

1. **Presentation Layer**: React Native components with Expo Router
2. **Service Layer**: API client with error handling and retry logic
3. **Data Layer**: Dual storage (SQLite + MySQL) with automatic sync

### Key Components

- **Scanner Interface**: `app/index.tsx` - Main camera view with overlay
- **API Client**: `src/webservice.ts` - HTTP client with axios
- **Data Models**: `src/models.ts` - TypeScript interfaces
- **Backend API**: `WebService/` - Express.js REST API

### Development Workflow

1. **Backend changes**: Restart with `npm start` in `WebService/`
2. **Frontend changes**: Hot reload automatically updates
3. **Database changes**: Update schema in `database.sql`
4. **API changes**: Test with tools like Postman or curl

### Platform Considerations

- **Web**: Limited camera access, use HTTPS in production
- **iOS**: Requires camera usage description in app.json
- **Android**: Adaptive icon and permissions configured

## 🚀 Deployment

### Backend Deployment
- Deploy to services like Heroku, DigitalOcean, or AWS
- Update database connection for production
- Configure environment variables for security

### Mobile App Deployment
- Build with `expo build` or EAS Build
- Submit to App Store/Google Play
- Update API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details

## 🔧 Troubleshooting

### Common Issues

**Camera not working**:
- Ensure permissions are granted
- Check device compatibility
- Restart the app

**API connection failed**:
- Verify backend server is running
- Check IP address in `webservice.ts`
- Ensure devices are on same network

**Database errors**:
- Verify MySQL service is running
- Check database credentials
- Ensure schema is properly initialized

### Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include device/platform information