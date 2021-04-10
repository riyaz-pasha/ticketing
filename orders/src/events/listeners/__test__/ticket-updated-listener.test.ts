import { TicketUpdatedEvent } from '@riyazpasha/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from "../../../nats-wrapper";
import { getId } from '../../../test/utils';
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        id: getId(),
        title: "movie 1",
        price: 100
    })
    await ticket.save();

    const data: TicketUpdatedEvent["data"] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: "movie 1",
        price: 150,
        userId: getId(),
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return { listener, msg, data, ticket };
}

it('finds, updates and saves a ticket', async () => {
    const { listener, msg, data, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket?.title).toBe(data.title);
    expect(updatedTicket?.price).toBe(data.price);
    expect(updatedTicket?.version).toBe(data.version);
});

it('acks the message', async () => {
    const { listener, msg, data } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalledTimes(1);
});

it('should not call if the event has a skipped version', async () => {
    const { listener, msg, data } = await setup();
    const futureEventData = {
        ...data,
        version: data.version + 1,
    }

    try {
        await listener.onMessage(futureEventData, msg);
    } catch (error) { }

    expect(msg.ack).not.toHaveBeenCalled();
    expect(msg.ack).toHaveBeenCalledTimes(0);
});
