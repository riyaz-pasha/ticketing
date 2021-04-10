import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@riyazpasha/ticketing-common';
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { getId } from "../../../test/utils";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: "movie 1",
        price: 100,
        userId: getId(),
    });
    await ticket.save();

    const data: OrderCreatedEvent["data"] = {
        id: getId(),
        version: 0,
        status: OrderStatus.Created,
        userId: getId(),
        expiresAt: "asdf",
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}

it('should set the userId to the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toHaveProperty("orderId", data.id);
});

it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalledTimes(1);
});
