import { OrderCancelledEvent, Subjects } from '@riyazpasha/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { getId } from "../../../test/utils";
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = getId();
    const ticket = Ticket.build({
        title: "movie 1",
        price: 100,
        userId: getId(),
    });
    ticket.set({ orderId })
    await ticket.save();

    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg, orderId }
}

it('should set the userId to undefined for that ticket', async () => {
    const { listener, ticket, data, msg, orderId } = await setup();
    expect(ticket).toHaveProperty("orderId", orderId);

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket).toHaveProperty("orderId", undefined);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalledTimes(1);
});

it('should publish ticket updated event', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
        Subjects.TicketUpdated,
        JSON.stringify({
            id: updatedTicket!.id,
            version: updatedTicket!.version,
            title: updatedTicket!.title,
            price: updatedTicket!.price,
            userId: updatedTicket!.userId,
            orderId: updatedTicket!.orderId,
        }),
        expect.anything()
    )
});
