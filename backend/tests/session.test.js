import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import "./setup.js";

describe("WorkSession CRUD API Endpoints", () => {
  let authToken;
  let testUserId;
  let createdSessionId;

  beforeAll(async () => {
    await request(app).post("/api/v1/auth/signup").send({
      name: "Session Developer",
      email: "sessiondev@example.com",
      password: "securepassword",
    });

    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: "sessiondev@example.com",
      password: "securepassword",
    });

    authToken = loginRes.body.token;
    testUserId = loginRes.body.user.id;
  });

  it("should create a new focus session successfully", async () => {
    const res = await request(app)
      .post("/api/v1/sessions")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        type: "Development",
        status: "In Progress",
        title: "Testing Mongoose Models",
        duration: 90,
        notes: "Writing unit tests for Express routers",
        link: "https://github.com/test",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("savedSession");
    expect(res.body.savedSession).toHaveProperty(
      "title",
      "Testing Mongoose Models",
    );

    createdSessionId = res.body.savedSession._id;
  });

  it("should get the list of focus sessions (paginated)", async () => {
    const res = await request(app)
      .get("/api/v1/sessions")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("sessions");
    expect(Array.isArray(res.body.sessions)).toBe(true);
    expect(res.body.sessions.length).toBe(1);
    expect(res.body.sessions[0]).toHaveProperty("_id", createdSessionId);
  });

  it("should update session details successfully", async () => {
    const res = await request(app)
      .put(`/api/v1/sessions/${createdSessionId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        type: "Development",
        status: "Completed",
        title: "Testing Mongoose Models - Updated",
        duration: 120,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "title",
      "Testing Mongoose Models - Updated",
    );
    expect(res.body).toHaveProperty("status", "Completed");
  });

  it("should block session creation if no authentication token is provided", async () => {
    const res = await request(app).post("/api/v1/sessions").send({
      type: "DSA",
      status: "In Progress",
      title: "Unauthorized Session",
      duration: 60,
    });

    expect(res.status).toBe(401);
  });

  it("should delete a session successfully", async () => {
    const res = await request(app)
      .delete(`/api/v1/sessions/${createdSessionId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Session Deleted Successfully!");

    const checkRes = await request(app)
      .get("/api/v1/sessions")
      .set("Authorization", `Bearer ${authToken}`);

    expect(checkRes.body.sessions.length).toBe(0);
  });

  it("should test the error middleware", async () => {
    const res1 = await request(app)
      .get("/api/v1/sessions")
      .set("Authorization", "Bearer   invalid-token-string");

    expect(res1.status).toBe(401);

    const res2 = 
      await request(app).put("/api/v1/sessions/invalid-session-id").set("Authorization", `Bearer ${authToken}`)
    .send({
      type: "DSA",
      status: "Completed",
      title: "11",
      duration: 45,
      notes: "Verifying error middleware in automated tests",
    })
    expect(res2.status).toBe(400)

    const res3 = await request(app).get("/api/v1/sessions/invalid-path").set("Authorization", `Bearer ${authToken}`)

    expect(res3.status).toBe(404)

  });

  it("should get the activity statistics successfully", async () => {
    const res = await request(app)
      .get("/api/v1/sessions/stats")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalSessions");
    expect(res.body).toHaveProperty("totalDuration");
    expect(res.body).toHaveProperty("sessionsByType");
  });

  afterAll(async () => {
    const collections = mongoose.connection.collections;
    if (collections.users) await collections.users.deleteMany({});
    if (collections.worksessions) await collections.worksessions.deleteMany({});
  });
});
