import request from "supertest";
import { app } from "../../app"

it('should have a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({})

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({})

    expect(response.status).toEqual(401);
    expect(response.unauthorized).toBeTruthy();
    expect(response.text).toContain("Not authorized");
});

it('should not return not authorized error when user is logged in', async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({})

    expect(response.status).not.toEqual(401);
    expect(response.unauthorized).not.toBeTruthy();
    expect(response.text).not.toContain("Not authorized");
});

it('should return an error if empty title is provided', async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "",
            price: 10,
        })

    expect(response.status).toEqual(400);
    expect(response.text).toContain("Title is required");
});

it('should return an error if no title is provided', async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            price: 10,
        })

    expect(response.status).toEqual(400);
    expect(response.text).toContain("Title is required");
});

it('should return an error if invalid price is provided', async () => {

});

it('should create a new ticket when valid inputs are passed', async () => {

});
