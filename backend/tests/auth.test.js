import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import "./setup.js";

describe("Authentication API Endpoints", () => {
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    if (collections.users) {
      await collections.users.deleteMany({});
    }
  });

  it("should create a new user successfully", async () => {
    const res = await request(app).post("/auth/signup").send({
      name: "Test Developer",
      email: "testdev@example.com",
      password: "securepassword123",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success", true);
  });

  it("should fail signup when the email is already registered", async () => {
    await request(app).post("/auth/signup").send({
      name: "First User",
      email: "duplicate@example.com",
      password: "password123",
    });

    const res = await request(app).post("/auth/signup").send({
      name: "Second User",
      email: "duplicate@example.com",
      password: "anotherpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should log in successfully and return a JWT token", async () => {
    await request(app).post("/auth/signup").send({
      name: "Login User",
      email: "login@example.com",
      password: "password123",
    });

    const res = await request(app).post("/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "login@example.com");
  });
});
