const request = require("supertest");
const express = require("express");
const router = require("../routing/index");

const app = express();
app.use(express.json());
app.use("/api", router);

describe("Checklist API", () => {
  it("should create a new checklist", async () => {
    const validData = {
      detailsId: "some-details-id",
      data: [{ key: "key1", value: "value1" }],
    };

    const response = await request(app).post("/api/checkList").send(validData);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid token");
  });
});
