# 🍽️ FoodieShare - Share, Discover & Celebrate Food

**FoodieShare** is a full-stack web application where users can **share recipes**, **explore dishes** from around the world, and **connect through food**. Built with the powerful MERN stack and containerized using Docker for easy deployment.

> Built with by Akilan .for food lovers, home cooks, and chefs alike.

---

## 🚀 Features

- 📸 Upload and browse recipes with images and descriptions
- 📝 Add ingredients, cooking steps, categories, and tags
- 🔍 Search recipes by keyword or category
- ❤️ Like, save, or comment on your favorite recipes
- 👤 User authentication (Login/Signup with JWT)
- ⚙️ RESTful API (Node.js + Express)
- 📦 MongoDB for recipe and user data storage
- 🐳 Fully Dockerized frontend & backend

---

## 🛠 Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| Frontend  | React.js + Tailwind CSS |
| Backend   | Node.js + Express.js   |
| Database  | MongoDB                |
| Auth      | JWT                    |
| Container | Docker & Docker Compose|

---

## 📦 Folder Structure
FoodieShare/
│
├── backend/              # Node.js + Express + MongoDB API
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── Dockerfile
│
├── frontend/             # React.js app
│   ├── src/
│   └── Dockerfile
│
├── docker-compose.yml    # Multi-container Docker config
└── README.md             # Project info

Create a .env file in the backend/ folder:

PORT=5000
MONGO_URI=mongodb://mongo:27017/foodieshare
JWT_SECRET=your_jwt_secret

# Step 1: Clone the repository
git clone https://github.com/Akilan3585/FoodieShare.git
cd FoodieShare

# Step 2: Run the app
docker-compose up --build

Author
 Akilan B
 AIML Student @ Sri Eshwar College of Engineering
 GitHub: Akilan3585
 Email: [akilanb28@gmail.com]


