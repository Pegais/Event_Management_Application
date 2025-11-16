# Event Management System

A full-stack MERN application for managing events across multiple users and timezones. This system allows admins to create user profiles, schedule events, and manage them with automatic timezone conversions.

## 🌟 Features

### Profile Management
- Create multiple user profiles
- Assign unique timezones to each profile
- Real-time timezone updates with UI refresh functionality
- Profile-specific event views

### Event Management
- Create events for single or multiple profiles simultaneously
- Multi-timezone support with automatic conversion
- Event assignment to multiple users
- Real-time event updates with timezone-aware timestamps
- Edit and update events with change tracking

### Timezone Handling
- Automatic timezone conversion for all events
- User-specific timezone settings
- Dynamic timezone updates across all events
- Real-time timezone conversion in event logs

### Event Update Logs (Bonus Feature)
- Complete audit trail of all event modifications
- Track who modified the event
- Show previous vs. updated values
- Timestamp tracking in user's selected timezone
- Automatic timezone conversion for all historical logs

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Day.js** - Date/time manipulation and timezone handling
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Deployment
- **AWS EC2** - Cloud hosting (Ubuntu 22.04 LTS)
- **PM2** - Process manager for Node.js applications
- **MongoDB** - Self-hosted on EC2

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn
- AWS account (for deployment)

## 🚀 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/Pegais/event-management-system.git
cd event-management-system
```

### 2. Setup Backend

```bash
cd server
npm install

# Create .env file
cat > .env << EOF
PORT=8000
MONGODB_URI=mongodb://localhost:27017/event-management
NODE_ENV=development
EOF

# Start backend
npm start
```

Backend will run on `http://localhost:8000`

### 3. Setup Frontend

```bash
cd client
npm install

# Update API URL in src/api/axiosApiClient.js
# baseURL: 'http://localhost:8000/api'

# Start frontend
npm start
```

Frontend will run on `http://localhost:3000`

## 🌐 Deployment on AWS EC2

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    AWS EC2 Instance                  │
│                  (Ubuntu 22.04 LTS)                  │
│                                                      │
│  ┌──────────────┐         ┌───────────────┐        │
│  │   Frontend   │         │    Backend    │        │
│  │  React App   │────────▶│  Express API  │        │
│  │  Port: 3000  │         │  Port: 8000   │        │
│  └──────────────┘         └───────┬───────┘        │
│                                    │                 │
│                           ┌────────▼────────┐       │
│                           │    MongoDB      │       │
│                           │  Port: 27017    │       │
│                           └─────────────────┘       │
│                                                      │
└─────────────────────────────────────────────────────┘
         │                           │
         ▼                           ▼
   Public Access              Public Access
   Port 3000                  Port 8000
```

### Deployment Steps

#### 1. Launch EC2 Instance
- **Instance Type:** t2.small or higher
- **AMI:** Ubuntu Server 22.04 LTS
- **Storage:** 20-30 GB
- **Security Group Rules:**
  - SSH (22) - Your IP only
  - Custom TCP (3000) - 0.0.0.0/0 (Frontend)
  - Custom TCP (8000) - 0.0.0.0/0 (Backend API)

#### 2. Connect to EC2

```bash
chmod 400 your-key.pem
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

#### 3. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

#### 4. Deploy Application

```bash
# Clone repository
cd /home/ubuntu
git clone https://github.com/your-username/event-management-system.git
cd event-management-system

# Setup Backend
cd server
npm install

# Create production .env
cat > .env << EOF
PORT=8000
MONGODB_URI=mongodb://localhost:27017/event-management
NODE_ENV=production
EOF

# Start backend with PM2
pm2 start server.js --name backend
pm2 save

# Setup Frontend
cd ../client
npm install

# Update API URL in src/api/axiosApiClient.js
# baseURL: 'http://YOUR-EC2-PUBLIC-IP:8000/api'

# Start frontend with PM2
pm2 start npm --name "frontend" -- start
pm2 save

# Setup PM2 to start on system reboot
pm2 startup
```

#### 5. Access Your Application

```
Frontend: http://YOUR-EC2-PUBLIC-IP:3000
Backend API: http://YOUR-EC2-PUBLIC-IP:8000
```

### Deployment Management

**Check Application Status:**
```bash
pm2 status
```

**View Logs:**
```bash
pm2 logs backend
pm2 logs frontend
```

**Restart Applications:**
```bash
pm2 restart backend
pm2 restart frontend
```

**Deploy Updates:**
```bash
cd /home/ubuntu/event-management-system
git pull origin main

# Update backend
cd server
npm install
pm2 restart backend

# Update frontend
cd ../client
npm install
pm2 restart frontend
```

## 📁 Project Structure

```
event-management-system/
├── client/                    # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── api/              # API client configuration
│   │   │   └── axiosApiClient.js
│   │   ├── features/         # Redux features
│   │   │   ├── profileFeature/
│   │   │   │   ├── ProfilePage.jsx
│   │   │   │   ├── ProfileForm.jsx
│   │   │   │   └── profiles.js (Redux slice)
│   │   │   └── eventFeature/
│   │   │       ├── EventList.jsx
│   │   │       ├── EventCard.jsx
│   │   │       ├── EventForm.jsx
│   │   │       └── Events.js (Redux slice)
│   │   ├── store/            # Redux store configuration
│   │   ├── utils/            # Utility functions
│   │   │   └── timezone.js   # Timezone conversion utilities
│   │   ├── styles/           # CSS files
│   │   └── App.js            # Main application component
│   ├── package.json
│   └── README.md
│
├── server/                    # Backend Express application
│   ├── controllers/          # Route controllers
│   │   ├── eventController.js
│   │   └── profileController.js
│   ├── models/               # MongoDB models
│   │   ├── Event.model.js
│   │   ├── Profile.model.js
│   │   └── EventLog.model.js
│   ├── routes/               # API routes
│   │   ├── eventRoutes.js
│   │   └── profileRoutes.js
│   ├── services/             # Business logic
│   │   ├── eventServices.js
│   │   └── profileServices.js
│   ├── utils/                # Utility functions
│   │   └── timezone.js       # Timezone conversion utilities
│   ├── middleware/           # Express middleware
│   ├── server.js             # Entry point
│   └── package.json
│
└── README.md                 # This file
```

## 🔧 API Endpoints

### Profile Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get all profiles |
| POST | `/api/profile/create` | Create new profile |
| PATCH | `/api/profile/:id` | Update profile timezone |

### Event Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events?profileId=:id` | Get events for a profile |
| POST | `/api/events/create` | Create new event |
| PATCH | `/api/events/:id` | Update event |
| GET | `/api/events/:id/logs` | Get event update logs |

## 💡 How It Works

### Timezone Management Flow

**1. Profile Creation:**
- Admin creates a user profile with a specific timezone (e.g., Asia/Kolkata)
- Timezone is stored in the database
- All events for this user will be displayed in their timezone

**2. Event Creation:**
- Admin selects profiles and creates an event
- Event times are entered in a specific timezone
- Backend converts times to UTC for storage
- Each assigned profile can view the event in their own timezone

**3. Event Viewing:**
- User logs in and selects their profile
- System fetches events assigned to that profile
- All event times are converted from UTC to user's timezone using Day.js
- User sees events in their local time

**4. Event Updates:**
- User edits an event
- System tracks who made the change (`modifiedBy`)
- Creates an event log entry with old and new values
- Timestamps are stored in UTC
- All users see the updated event in their respective timezones

**5. Update Logs:**
- When viewing update history, system fetches logs from EventLog collection
- Each log contains: who modified, when, and what changed
- All timestamps are converted to viewer's timezone
- If user changes their timezone, all historical logs automatically update

### State Management with Redux

```javascript
// Redux Store Structure
{
  profiles: {
    list: [],              // All profiles
    selectedId: null,      // Currently selected profile
    loading: false
  },
  events: {
    list: [],              // Events for selected profile
    logs: {},              // Event logs by eventId
    loading: false
  }
}
```

### Timezone Conversion Utilities

```javascript
// Convert UTC to user's local timezone
utcToLocal(utcDate, timezone) → "Nov 16, 2025, 10:30 AM IST"

// Convert local time to UTC for storage
localToUTC(localDate, timezone) → UTC Date Object
```

## 🎯 Key Features Implementation

### 1. Multi-timezone Support
- Uses Day.js with timezone plugin
- All dates stored in UTC in MongoDB
- Conversion happens on frontend based on selected profile's timezone
- Dynamic timezone switching with instant UI updates

### 2. Event Update Tracking
- Separate EventLog collection stores change history
- Diff algorithm tracks field-level changes
- Populated references show user names in logs
- Chronological display with newest changes first

### 3. Real-time Updates
- Redux state management ensures consistent UI
- PM2 keeps applications running 24/7
- Automatic restarts on crashes
- Zero-downtime deployments possible

## 🐛 Troubleshooting

### Backend Issues

```bash
# Check backend logs
pm2 logs backend

# Restart backend
pm2 restart backend

# Check if port 8000 is listening
ss -tlnp | grep 8000

# Check MongoDB status
sudo systemctl status mongodb
```

### Frontend Issues

```bash
# Check frontend logs
pm2 logs frontend

# Restart frontend
pm2 restart frontend

# Clear cache and reinstall
cd /home/ubuntu/event-management-system/client
rm -rf node_modules package-lock.json
npm install
pm2 restart frontend
```

### Database Issues

```bash
# Restart MongoDB
sudo systemctl restart mongodb

# Check MongoDB logs
sudo journalctl -u mongodb -n 50

# Access MongoDB shell
mongo
> use event-management
> db.events.find()
```

## 📊 Performance Considerations

- **PM2 Cluster Mode:** Can be enabled for better performance
- **Database Indexing:** Indexes on `profiles` field in events for faster queries
- **Caching:** Can implement Redis for frequently accessed data
- **CDN:** Static assets can be served via CloudFront

## 🔐 Security Best Practices

- Environment variables for sensitive data
- CORS configured to allow specific origins only
- Input validation and sanitization
- MongoDB connection with authentication (recommended for production)
- HTTPS setup with SSL certificate (recommended)

## 📝 Environment Variables

### Backend (.env)

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/event-management
NODE_ENV=production
```

### Frontend

Update `src/api/axiosApiClient.js`:

```javascript
baseURL: 'http://YOUR-EC2-IP:8000/api'
```

## 🚦 Current Deployment Status

**Live Application URLs:**
- Frontend: `http://YOUR-EC2-PUBLIC-IP:3000`
- Backend API: `http://YOUR-EC2-PUBLIC-IP:8000`
- Database: MongoDB running locally on EC2 (port 27017)

**Process Management:**
- Both applications managed by PM2
- Auto-restart on failure
- Persistent across system reboots

**Monitoring:**

```bash
pm2 monit  # Real-time monitoring
pm2 status # Check application status
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name
- GitHub: https://github.com/Pegais
- Email: snehal9140@gmail.com

## 🙏 Acknowledgments

- Day.js for timezone handling
- Redux Toolkit for state management
- MongoDB for flexible data storage
- AWS EC2 for reliable hosting
- PM2 for process management

## 📞 Support

For support, email snehal9140@gmail.com or create an issue in the GitHub repository.

---

**Note:** This is a demonstration project for an Event Management System assignment. For production use, additional security measures, monitoring, and optimization would be recommended.
