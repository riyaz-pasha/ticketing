import request from "supertest";
import { app } from "../../app";

const signupRequest = (reqBody: any) => request(app)
    .post("/api/users/signup")
    .send(reqBody)

const currentUserequest = (cookie: any) => request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()

it('should responds with the details of the current user', async () => {
    const email = "test@test.com";
    const authResponse = await signupRequest({
        email: email,
        password: "password",
    }).expect(201);
    const cookie = authResponse.get("Set-Cookie");

    const response = await currentUserequest(cookie)
        .expect(200)

    expect(response.body.currentUser).not.toBeNull();
    expect(response.body.currentUser.email).toStrictEqual(email);
});

it('should responds with null if not authenticated', async () => {
    const response = await request(app)
        .get("/api/users/currentuser")
        .send()
        .expect(200)

    expect(response.body.currentUser).toBeNull();
});
