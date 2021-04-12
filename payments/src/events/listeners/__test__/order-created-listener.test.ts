import { OrderCreatedEvent, OrderStatus } from '@riyazpasha/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { natsWrapper } from "../../../nats-wrapper";
import { getId } from "../../../test/utils";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = {
        id: getId(),
        price: 100,
    };
    const data: OrderCreatedEvent["data"] = {
        id: getId(),
        version: 0,
        status: OrderStatus.Created,
        userId: getId(),
        expiresAt: "asdf",
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}

it('replicates the order info', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order).toBeDefined();
    expect(order!.id).toEqual(data.id);
    expect(order!.version).toEqual(data.version);
    expect(order!.userId).toEqual(data.userId);
    expect(order!.status).toEqual(data.status);
    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalledTimes(1);
});
