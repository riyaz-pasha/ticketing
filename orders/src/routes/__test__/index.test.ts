import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const getOrders = (userCookie: string[]) => request(app)
    .get("/api/orders")
    .set("Cookie", userCookie)

const makeOrder = (ticketId: string, userCookie?: string[]) => request(app)
    .post("/api/orders")
    .set("Cookie", userCookie || global.signin())
    .send({ ticketId });

const buildTicket = async () => {
    const ticket = Ticket.build({ title: "Movie Name", price: 100 });
    await ticket.save();
    return ticket;
}

it('should return orders of the user', async () => {
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();
    const user1 = global.signin();
    const user2 = global.signin();
    const { body: user2Order1 } = await makeOrder(ticket2.id, user2);
    const { body: user2Order2 } = await makeOrder(ticket3.id, user2);

    const response = await getOrders(user2);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(user2Order1.id);
    expect(response.body[0].ticket.id).toEqual(ticket2.id);
    expect(response.body[1].id).toEqual(user2Order2.id);
    expect(response.body[1].ticket.id).toEqual(ticket3.id);
});