import { Subjects } from "@riyazpasha/ticketing-common";
import request from "supertest";
import { app } from "../../app"
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

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

it('should return an error if 0 is provided as price', async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "title",
            price: 0,
        })

    expect(response.status).toEqual(400);
    expect(response.text).toContain("Price must be greater than 0");
});

it('should return an error if proce is not provided', async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "title",
        })

    expect(response.status).toEqual(400);
    expect(response.text).toContain("Price must be greater than 0");
});

it('should create a new ticket when valid inputs are passed', async () => {
    const title = "title";
    const price = 123;
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title,
            price,
        })

    expect(response.status).toEqual(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(title);
    expect(tickets[0].price).toEqual(price);

});

it('should publish an event on successful ticket creation', async () => {
    const title = "title";
    const price = 123;
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title,
            price,
        })

    expect(response.status).toEqual(201);
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
});
