import { Listener, Subjects, TicketUpdatedEvent } from '@riyazpasha/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {
        const ticket = await Ticket.findById(data.id);
        if (!ticket) throw new Error("Ticket not found");

        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }

}

export {
    TicketUpdatedListener,
};