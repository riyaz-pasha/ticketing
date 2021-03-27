import request from "supertest";
import { app } from "../../app";

const signupRequest = (reqBody: any) => request(app)
    .post("/api/users/signup")
    .send(reqBody)

const signoutRequest = (reqBody: any) => request(app)
    .post("/api/users/signout")
    .send(reqBody)

it('should clears the cookie after signing out', async () => {
    const signupResponse = await signupRequest({
        email: "test@test.com",
        password: "password",
    }).expect(201)
    expect(signupResponse.get("Set-Cookie")).toBeDefined();

    const response = await signoutRequest({})
        .expect(200)

    expect(response.get("Set-Cookie")[0])
        .toEqual('express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
});