import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const getOrderById = (orderId: string, userCookie: string[]) => request(app)
    .get(`/api/orders/${orderId}`)
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

it('should fetch order details', async () => {
    const ticket1 = await buildTicket();
    const user1 = global.signin();
    const { body: user1Order1 } = await makeOrder(ticket1.id, user1);

    const response = await getOrderById(user1Order1.id, user1);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(user1Order1);
});

it('should not fetch other user order details', async () => {
    const ticket1 = await buildTicket();
    const user1 = global.signin();
    const user2 = global.signin();
    const { body: user1Order1 } = await makeOrder(ticket1.id, user1);

    const response = await getOrderById(user1Order1.id, user2);

    expect(response.status).toEqual(401);
    expect(response.body.errors[0].message).toEqual("Not authorized");
});
