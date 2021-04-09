import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { getId } from "../../test/utils";

const makeOrder = (ticketId: string, userCookie?: string[]) => request(app)
    .post("/api/orders")
    .set("Cookie", userCookie || global.signin())
    .send({ ticketId });

it('should return an error if the ticket does not exists', async () => {
    const ticketId = getId();

    const response = await makeOrder(ticketId);

    expect(response.status).toEqual(404);
    expect(response.body.errors[0].message).toEqual("Not Found");
});

it('should return an error if ticket is already reserved', async () => {
    const ticket = Ticket.build({ title: "Movie Name", price: 100, });
    await ticket.save();
    const order = Order.build({ ticket, userId: "asdfasdf", status: OrderStatus.Created, expiresAt: new Date() });
    await order.save();

    const response = await makeOrder(ticket.id);

    expect(response.status).toEqual(400);
    expect(response.body.errors[0].message).toEqual("Ticket is already reserved");
});

it('should reserves a ticket', async () => {
    const ticket = Ticket.build({ title: "Movie Name", price: 100, });
    await ticket.save();

    const response = await makeOrder(ticket.id);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("expiresAt");
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("ticket");
});

