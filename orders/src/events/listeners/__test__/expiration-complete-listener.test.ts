import { ExpirationCompleteEvent, OrderStatus, Subjects } from '@riyazpasha/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from "../../../nats-wrapper";
import { getId } from '../../../test/utils';
import { ExpirationCompleteListener } from '../expiration-complete-listener';

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client)

    const ticket = Ticket.build({
        id: getId(),
        title: "movie 1",
        price: 100,
    })
    await ticket.save();
    const order = Order.build({
        userId: getId(),
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    })
    await order.save();

    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id,
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return { listener, msg, data, ticket, order };
}

it('should update the order status to cancelled', async () => {
    const { listener, msg, data, ticket, order } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder).toBeDefined();
    expect(updatedOrder?.status).toBe(OrderStatus.Cancelled);
});

it('should emit order cancelled event', async () => {
    const { listener, msg, data, ticket, order } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
        Subjects.OrderCancelled,
        JSON.stringify({
            id: order.id,
            version: order.version + 1,
            ticket: {
                id: order.ticket.id,
            }
        }),
        expect.anything()
    );

});

it('acks the message', async () => {
    const { listener, msg, data } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalledTimes(1);
});
