import request from "supertest";
import app from "../app.js";
import "./setup.js";
import mongoose from "mongoose";

describe("End-to-End User Flow   Integration Test", () => {
  let authToken;
  let createdSessionId;

  afterAll(async () => {
    const collections = mongoose.connection.collections;
    if (collections.users) await collections.users.deleteMany({});
    if (collections.worksessions) await collections.worksessions.deleteMany({});
  });

  it("should run the full developer journey: signup -> login -> create sessions -> get sessions -> delete session", async () => {
    const testEmail = "e2e-developer@example.com";
    const testPassword = "e2ebuildermuscle";

    const signupRes = await request(app).post("/api/v1/auth/signup").send({
      name: "E2E Developer",
      email: testEmail,
      password: testPassword,
    });
    expect(signupRes.status).toBe(201);
    expect(signupRes.body).toHaveProperty("success", true);

    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: testEmail,
      password: testPassword,
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
    authToken = loginRes.body.token;

    const createSessionRes = await request(app)
      .post("/api/v1/sessions")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        type: "DSA",
        status: "Completed",
        title: "E2E Stack Integration",
        duration: 45,
        notes: "Verifying middleware stacks in automated tests",
      });
    expect(createSessionRes.status).toBe(201);
    expect(createSessionRes.body).toHaveProperty("savedSession");
    createdSessionId = createSessionRes.body.savedSession._id;

    const getSessionRes = await request(app)
      .get("/api/v1/sessions")
      .set("Authorization", `Bearer ${authToken}`);
    expect(getSessionRes.status).toBe(200);
    expect(getSessionRes.body).toHaveProperty("sessions");
    expect(getSessionRes.body.sessions.length).toBe(1);
    expect(getSessionRes.body.sessions[0]).toHaveProperty(
      "title",
      "E2E Stack Integration",
    );

    const deleteSessionRes = await request(app)
      .delete(`/api/v1/sessions/${createdSessionId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(deleteSessionRes.status).toBe(200);
    expect(deleteSessionRes.body).toHaveProperty(
      "message",
      "Session Deleted Successfully!",
    );

    const verifyRes = await request(app)
      .get("/api/v1/sessions")
      .set("Authorization", `Bearer ${authToken}`);
    expect(verifyRes.body.sessions.length).toBe(0);
  });

  it("should block unauthenticated access to protected session routes", async () => {
    const getRes = await request(app).get("/api/v1/sessions");
    expect(getRes.status).toBe(401);

    const postRes = await request(app).post("/api/v1/sessions").send({
      type: "DSA",
      status: "Completed",
      title: "Should Fail",
      duration: 30,
    });
    expect(postRes.status).toBe(401);
  });
});
