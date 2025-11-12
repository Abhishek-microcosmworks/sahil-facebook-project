import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

import User from "./models/User.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";

const MONGO_URI = process.env.MONGO_URI;

async function seedDatabase() {
  try {
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected!");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    console.log("🧹 Cleared existing collections");

    const users = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        name: faker.person.fullName(),
        username: faker.internet.username().toLowerCase(),
        email: faker.internet.email().toLowerCase(),
        password: "123456", // hashed later
        bio: faker.lorem.sentence(),
        profile_picture: faker.image.avatar(),
        cover_photo: faker.image.urlPicsumPhotos(),
        created_at: new Date(),
      });
    }

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    const posts = [];
    createdUsers.forEach(user => {
      for (let i = 0; i < 2; i++) {
        posts.push({
          user_id: user._id,
          content: faker.lorem.paragraph(),
          image_url: faker.image.urlPicsumPhotos(),
          visibility: "public",
          created_at: new Date(),
        });
      }
    });

    const createdPosts = await Post.insertMany(posts);
    console.log(`✅ Created ${createdPosts.length} posts`);

    const comments = [];
    createdPosts.forEach(post => {
      for (let i = 0; i < 2; i++) {
        comments.push({
          post_id: post._id,
          user_id: faker.helpers.arrayElement(createdUsers)._id,
          text: faker.lorem.sentence(),
          created_at: new Date(),
        });
      }
    });

    await Comment.insertMany(comments);
    console.log(`✅ Created ${comments.length} comments`);

    console.log("🎉 Database seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seedDatabase();
