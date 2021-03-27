import request from "supertest";
import { app } from "../../app";

const signupRequest = (reqBody: any) => request(app)
    .post("/api/users/signup")
    .send(reqBody)

const signinRequest = (reqBody: any) => request(app)
    .post("/api/users/signin")
    .send(reqBody)

it('should return status 400 when a email that doesnot exists is supplied', async () => {
    return signinRequest({
        email: "some@email.com",
        password: "password",
    }).expect(400)
});


it('should return status 400 when incorrect password is supplied', async () => {
    await signupRequest({
        email: "some@email.com",
        password: "password",
    }).expect(201)

    await signinRequest({
        email: "some@email.com",
        password: "pasword",
    }).expect(400)
});

it('should respond with a cookie when valid credentials supplied', async () => {
    await signupRequest({
        email: "some@email.com",
        password: "password",
    }).expect(201)

    const response = await signinRequest({
        email: "some@email.com",
        password: "password",
    }).expect(200)

    expect(response.get("Set-Cookie")).toBeDefined();
});

