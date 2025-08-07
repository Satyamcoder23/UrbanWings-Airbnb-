
# 🏡 Airbnb Clone – Full-Stack Web App

A fully responsive, feature-rich Airbnb-style listing platform built with **Node.js**, **Express**, **MongoDB**, and **EJS**, following a clean **MVC architecture**. Users can explore curated stays, filter by category, toggle pricing with tax, and (optionally) view listings on an interactive map — all wrapped in a polished, mobile-first UI.

---

## 🚀 Features at a Glance

- 🔍 **Explore Listings** – Browse all available stays with images, location, and pricing
- 🧭 **Category Filters** – Filter by Rooms, Castles, Domes, Farms, and more
- 📱 **Responsive Design** – Mobile-first layout with dropdown filters and adaptive cards
- 💰 **Tax Toggle** – Switch to display total price including GST
- 🧾 **Dynamic Routing** – View individual listing details via dynamic URLs
- 🗺️ **Map Integration** – Optional Mapbox-powered interactive maps
- 🔐 **Authentication** – Sign Up / Login / Logout flow (if implemented)
- 🧹 **Modular MVC Structure** – Clean separation of routes, views, models, and controllers

---

## 🛠️ Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | HTML, CSS, Bootstrap, EJS      |
| Backend      | Node.js, Express.js            |
| Database     | MongoDB, Mongoose              |
| UI Icons     | Font Awesome                   |
| Optional     | Mapbox (for geolocation/maps)  |

---

## 🌱 Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env


CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
MAPBOX_TOKEN=your_mapbox_token
DB_URL=your_mongo_url
SESSION_SECRET=your_session_secret
