import request from "supertest";
import { app } from "../../app";

const signupRequest = (reqBody) => request(app)
    .post("/api/users/signup")
    .send(reqBody)

it('should return a 201 response on succcessful signup', async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(201)
});

it('should disallow duplicate signups', async () => {
    await signupRequest({
        email: "same@mail.com",
        password: "password",
    }).expect(201)

    await signupRequest({
        email: "same@mail.com",
        password: "password",
    }).expect(400)
});

it('should return a 400 when in valid email is passed', async () => {
    return signupRequest({
        email: "test",
        password: "password",
    }).expect(400)
});

it('should return a 400 when in valid password is passed', async () => {
    return signupRequest({
        email: "test@test.com",
        password: "p",
    }).expect(400)
});

it('should return a 400 when email & password are missing', async () => {
    return signupRequest({})
        .expect(400)
});

it('should return a 400 when email is missing', async () => {
    return signupRequest({
        password: "password",
    }).expect(400)
});

it('should return a 400 when password is missing', async () => {
    return signupRequest({
        email: "test@test.com",
    }).expect(400)
});
