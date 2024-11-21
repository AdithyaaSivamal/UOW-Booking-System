Frontend
- By default, rooms are displayed in a calendar
- Available rooms are displayed in a list
- User can filter rooms by time, date, location, availability
- User can book a room

Backend
- DB: Mongo or SQL
- Live server: Node, Express, Axios, etc
- User Actions (Standard API calls)

--------------------------------------------------

Program Features
- DB store booking information: Time, Date, Location, Availability
- Cross-validation loginr requests with UOW API
- Store user booking history


User Actions:
 - Users login with UOW ID and/or email
 - Scroll through rooms
 - Filters: Time, Date, Location, availability
 - Book a room
 - Cancel a booking
 - View booking history
 
Updates:
- Super-user/Admin
    - create accounts
    - manage accouts
    - view last login/logout

-sysadmin
    - approve newly created rooms
    - view currnet status of a room(pending approval, approval, rejected, restore)
    - view who booked a room by date
    



- .env raw content
---------------------------------------------------------
PORT=5000
MONGO_URI=mongodb+srv://asivamal:Adipers0n@cluster0.bxbhflt.mongodb.net/UOW_Booking_System?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET='YvLo5ufpClFGvWIvDjQ+tPNEI2VyLs6xCQn0zbuGeBKCbjHpatNT0FPIfhCprFKh0/rTfGVMTckH9N6KWy1jsg=='

----------------------------------------------------------


- ./config/db.js raw content
----------------------------------------------------------
// config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Additional options can be added here
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

----------------------------------------------------------
