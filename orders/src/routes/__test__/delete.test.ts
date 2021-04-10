import { Subjects } from "@riyazpasha/ticketing-common";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

const deleteOrderById = (orderId: string, userCookie: string[]) => request(app)
    .delete(`/api/orders/${orderId}`)
    .set("Cookie", userCookie)
    .send()

const makeOrder = (ticketId: string, userCookie?: string[]) => request(app)
    .post("/api/orders")
    .set("Cookie", userCookie || global.signin())
    .send({ ticketId });

const buildTicket = async () => {
    const ticket = Ticket.build({ title: "Movie Name", price: 100 });
    await ticket.save();
    return ticket;
}

it('should change the status of order to cancelled', async () => {
    const ticket1 = await buildTicket();
    const user1 = global.signin();
    const { body: user1Order1 } = await makeOrder(ticket1.id, user1);

    const response = await deleteOrderById(user1Order1.id, user1);

    expect(response.status).toEqual(204);
    const updatedOrder = await Order.findById(user1Order1.id);
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('should not cancel other user order details', async () => {
    const ticket1 = await buildTicket();
    const user1 = global.signin();
    const user2 = global.signin();
    const { body: user1Order1 } = await makeOrder(ticket1.id, user1);

    const response = await deleteOrderById(user1Order1.id, user2);

    expect(response.status).toEqual(401);
    expect(response.body.errors[0].message).toEqual("Not authorized");
});

it('should order cancelled event', async () => {
    const ticket1 = await buildTicket();
    const user1 = global.signin();
    const { body: user1Order1 } = await makeOrder(ticket1.id, user1);

    const response = await deleteOrderById(user1Order1.id, user1);

    expect(response.status).toEqual(204);
    expect(natsWrapper.client.publish.mock.calls[1][0]).toStrictEqual(Subjects.OrderCancelled);
});
