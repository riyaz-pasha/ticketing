import { TicketCreatedEvent } from "@riyazpasha/ticketing-common";
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from "../../../nats-wrapper";
import { getId } from "../../../test/utils";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client)

    const data: TicketCreatedEvent["data"] = {
        id: getId(),
        version: 0,
        title: "movie 1",
        price: 100,
        userId: getId(),
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return { listener, msg, data };
}

it('should save the ticket', async () => {
    const { listener, msg, data } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket?.title).toBe(data.title);
    expect(ticket?.price).toBe(data.price);
});

it('acks the message', async () => {
    const { listener, msg, data } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalledTimes(1);
});
