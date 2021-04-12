import { OrderCancelledEvent, OrderStatus } from '@riyazpasha/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { natsWrapper } from "../../../nats-wrapper";
import { getId } from "../../../test/utils";
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const ticket = {
        id: getId(),
        price: 100,
    };

    const order = Order.build({
        id: getId(),
        version: 0,
        status: OrderStatus.Created,
        userId: getId(),
        price: ticket.price,
    });
    await order.save();

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: ticket.id,
        },
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg, order };
}

it('updates the order status', async () => {
    const { listener, data, msg, order, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder).toBeDefined();
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalledTimes(1);
});
