# ScanQR

A modern QR code scanner app built with React Native and Expo.

## Features

- 📱 QR Code and barcode scanning
- 📍 Location tracking
- 💾 Scan history with local storage
- 🔄 Camera flip functionality
- 📋 Copy scanned codes to clipboard
- 🌐 Web service integration for data persistence

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express
- **Database**: MySQL with Knex.js
- **Camera**: expo-camera
- **Location**: expo-location
- **Storage**: expo-sqlite (local) + MySQL (remote)

## Project Structure

```
├── app/                    # Expo Router pages
├── src/                    # Source code
│   ├── models.ts          # TypeScript interfaces
│   └── webservice.ts      # API client
├── WebService/            # Backend API
│   ├── app.js            # Express server
│   ├── model/            # Database models
│   └── routes/           # API routes
└── assets/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- MySQL database

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ScanQR
```

2. Install dependencies:
```bash
npm install
```

3. Set up the backend:
```bash
cd WebService
npm install
```

4. Configure the database:
   - Create a MySQL database named `scanqr`
   - Update connection settings in `WebService/model/_database.js`
   - Run the SQL script in `WebService/database.sql`

5. Start the backend server:
```bash
cd WebService
npm start
```

6. Update the API endpoint:
   - In `src/webservice.ts`, update `hostApi` to your machine's IP address
   - Replace `http://localhost:3000` with `http://YOUR_IP:3000`

7. Start the Expo development server:
```bash
npm start
```

## Usage

1. Grant camera and location permissions when prompted
2. Point the camera at a QR code or barcode
3. The scanned code will be displayed and saved automatically
4. View scan history in the bottom section
5. Tap the copy button to copy codes to clipboard
6. Use the flip button to switch between front and rear cameras

## API Endpoints

- `GET /codigos` - Get all scanned codes
- `GET /codigos/:id` - Get a specific code by ID
- `POST /codigos` - Create a new scanned code
- `PUT /codigos/:id` - Update a code by ID
- `DELETE /codigos/:id` - Delete a code by ID

## Development

The app uses Expo Router for navigation and supports both local SQLite storage and remote MySQL storage through the web service.

### Key Components

- **Camera Scanner**: Real-time QR/barcode scanning with overlay
- **Location Service**: GPS coordinates display
- **History Management**: Local and remote data synchronization
- **Responsive Design**: Modern UI with dark theme

## License

ISC License