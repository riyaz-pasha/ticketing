import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { getId } from '../../test/utils';

type TicketAttrs = {
    title?: string;
    price?: number;
};


let user1cookie: string[] = [""];
const ticketDetails = { title: "title", price: 1 };

const updateTicket = (id: string, body: TicketAttrs, cookie: string[]) => request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send(body)

const creatTicket = (body: TicketAttrs, cookie: string[]) => request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(body)

const getTicketById = (id: string) => request(app)
    .get(`/api/tickets/${id}`)
    .send()

beforeAll(() => {
    user1cookie = global.signin();
})

it('should return 401 if user is not authenticated', async () => {
    const usercookie = [""];
    const id = getId();
    const updateTicketDetails = { title: "new-title", price: 1 };

    const response = await updateTicket(id, updateTicketDetails, usercookie)

    expect(response.status).toStrictEqual(401);
    expect(response.body.errors[0].message).toStrictEqual("Not authorized");
});

it('should return 404 if provided id doesnot exist', async () => {
    const id = getId();
    const updatedTicketDetails = { title: "new-title", price: 1 };

    const response = await updateTicket(id, updatedTicketDetails, user1cookie)

    expect(response.status).toStrictEqual(404);
    expect(response.body.errors[0].message).toStrictEqual("Not Found");
});

it('should return 401 if user doesnot own the ticket', async () => {
    const user2cookie = global.signin();
    const updatedTicketDetails = { title: "new-title", price: 1 };
    const createTicketResponse = await creatTicket(ticketDetails, user1cookie);

    const response = await updateTicket(createTicketResponse.body.id, updatedTicketDetails, user2cookie);

    expect(response.status).toStrictEqual(401);
    expect(response.body.errors[0].message).toStrictEqual("Not authorized");
});

it('should return an error if empty title is provided', async () => {
    const updatedTicketDetails = { title: "", price: 1 };
    const createTicketResponse = await creatTicket(ticketDetails, user1cookie);

    const response = await updateTicket(createTicketResponse.body.id, updatedTicketDetails, user1cookie);

    expect(response.status).toEqual(400);
    expect(response.body.errors[0].message).toContain("Title is required");
});

it('should return an error if no title is provided', async () => {
    const updatedTicketDetails = { price: 1 };
    const createTicketResponse = await creatTicket(ticketDetails, user1cookie);

    const response = await updateTicket(createTicketResponse.body.id, updatedTicketDetails, user1cookie);

    expect(response.status).toEqual(400);
    expect(response.body.errors[0].message).toContain("Title is required");
});

it('should return an error if 0 is provided as price', async () => {
    const updatedTicketDetails = { title: "", price: 0 };
    const createTicketResponse = await creatTicket(ticketDetails, user1cookie);

    const response = await updateTicket(createTicketResponse.body.id, updatedTicketDetails, user1cookie);


    expect(response.status).toEqual(400);
    expect(response.text).toContain("Price must be greater than 0");
});

it('should return an error if price is not provided', async () => {
    const updatedTicketDetails = { title: "title" };
    const createTicketResponse = await creatTicket(ticketDetails, user1cookie);

    const response = await updateTicket(createTicketResponse.body.id, updatedTicketDetails, user1cookie);


    expect(response.status).toEqual(400);
    expect(response.text).toContain("Price must be greater than 0");
});

it('should update the ticket when valid details is provided', async () => {
    const title = "new-title";
    const price = 100;
    const updatedTicketDetails = { title, price };
    const createTicketResponse = await creatTicket(ticketDetails, user1cookie).expect(201);

    const updateResponse = await updateTicket(createTicketResponse.body.id, updatedTicketDetails, user1cookie);
    expect(updateResponse.status).toEqual(200);

    const response = await getTicketById(createTicketResponse.body.id);
    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual(title);
    expect(response.body.price).toEqual(price);

});

it('should not allow the user to edit the ticket which is reserved', async () => {
    const updatedTicketDetails = { title: "new-title", price: 1 };
    const createTicketResponse = await creatTicket(ticketDetails, user1cookie).expect(201);
    const ticket = await Ticket.findById(createTicketResponse.body.id);
    const orderId = getId();
    ticket?.set({ orderId });
    await ticket?.save();

    const response = await updateTicket(createTicketResponse.body.id, updatedTicketDetails, user1cookie)

    expect(response.status).toStrictEqual(400);
    expect(response.body.errors[0].message).toStrictEqual("Cannot edit a reserved Ticket");
});
