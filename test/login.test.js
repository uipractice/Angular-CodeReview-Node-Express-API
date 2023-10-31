const request = require("supertest");
const express = require("express");
const router = require("../routing/index");

const app = express();
app.use(express.json());
app.use("/api", router);

jest.mock("../db/connection", () => {
  return require("./test-setup/db-setup");
});
describe("Login API", () => {
  it("should return success with valid credentials", async () => {
    const credentials = {
      email: "rgaddam@evoketechnologies.com",
      password: "Test@123",
    };

    const response = await request(app).post("/api/login").send(credentials);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.success).toBe(true);
  });

  it("should return error with invalid credentials", async () => {
    const credentials = {
      email: "rgaddam@evoketechnologies.com",
      password: "Test@1231",
    };

    const response = await request(app).post("/api/login").send(credentials);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid password");
  });

  it("should return error with non-existing email", async () => {
    const credentials = {
      email: "test@example1.com",
      password: "testpassword",
    };

    const response = await request(app).post("/api/login").send(credentials);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Email not existed")
  });
});
