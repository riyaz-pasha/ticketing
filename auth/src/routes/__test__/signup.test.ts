import request from "supertest";
import { app } from "../../app";

it('should return a 201 response on succcessful signup', async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(201)
});
