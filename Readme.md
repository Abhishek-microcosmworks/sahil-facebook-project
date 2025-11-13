# 📘 Facebook Backend API (Node.js + Express + MongoDB)

## A complete social media backend with:

- ✅ Authentication (JWT)
- ✅ Posts with images
- ✅ Likes (post & comment)
- ✅ Comments & replies
- ✅ Friend requests
- ✅ User settings
- ✅ Block users
- ✅ Upload profile/cover/post images
- ✅ Notifications
- ✅ REST API structure
- ✅ Postman collections included
- ✅ Seed script for fake users

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB / Mongoose
- Multer (uploads)
- bcryptjs (password hashing)
- JWT
- dotenv
- cors
- morgan

<<<<<<< HEAD
=======
## 📁 Project Folder Structure
```
backend-facebook-project/
│
├── src/
│   ├── app.js
│   ├── server.js
│   ├── seed.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Reply.js
│   │   ├── PostLike.js
│   │   ├── CommentLike.js
│   │   ├── Friend.js
│   │   ├── FriendRequest.js
│   │   ├── Share.js
│   │   ├── BlockedUser.js
│   │   ├── UserSettings.js
│   │   └── Token.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   ├── comment.controller.js
│   │   ├── friend.controller.js
│   │   ├── settings.controller.js
│   │   └── upload.middleware.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── post.service.js
│   │   ├── comment.service.js
│   │   ├── friend.service.js
│   │   └── settings.service.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   ├── comment.routes.js
│   │   └── friend.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── error.middleware.js
│   │   └── notFound.middleware.js
│   │
│   ├── validations/
│   │   ├── auth.validation.js
│   │   ├── user.validation.js
│   │   ├── comment.validation.js
│   │   └── friend.validation.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── bcrypt.js
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   └── constants.js
│   │
│   ├── uploads/
│   │   ├── profiles/
│   │   ├── covers/
│   │   └── posts/
│   │
│   ├── logs/
│   │   ├── app.log
│   │   └── error.log
│   │
│   └── tests/
│       ├── setup.js
│       └── auth.test.js
│
├── node_modules/
│
├── .git/
│
├── .gitignore
├── .env
├── package.json
├── package-lock.json
├── SingleUser.postman_collection.json
├── DualUser.postman_collection.json
└── Readme.md
```

---

## 🔧 Environment Variables (.env)

- Create a .env file:
```
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/
JWT_SECRET=supersecretkey
NODE_ENV=development
```

---

## 🏁 Install & Run Project Locally
### ✅ Install dependencies
`npm install`

### ✅ Start development server
`npm run dev`


> You should see:
```
✅ Server running on port 5000
✅ MongoDB connected successfully
📌 API Base URL: http://localhost:5000/api

📌 API Base URL
http://localhost:5000/api
```


### ✅ Seeding the Database

- This project includes a seed script that generates:

> ✅ Fake users
> ✅ Fake posts
> ✅ Fake comments

> Run seeder:
`npm run seed`


- You’ll see:
```
✅ Connected!
🧹 Cleared existing collections
✅ Created 10 users
✅ Created 20 posts
✅ Created 40 comments
🎉 Database seeding complete!
```
---

## ✅ Testing with Postman


- Import them in Postman



### ✅ Testing Flow 
- 1️⃣ Register
- 2️⃣ Login
- 3️⃣ Create post
- 4️⃣ Add comment
- 5️⃣ Reply
- 6️⃣ Like post
- 7️⃣ Like comment
- 8️⃣ Get All Users Details


> Everything is auto-filled:
> ✅ token
> ✅ userId
> ✅ postId
> ✅ commentId
