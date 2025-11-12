import request from "supertest";
import app from "../app.js";

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should login successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "testuser",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
