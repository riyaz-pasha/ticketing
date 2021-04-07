import { Subjects } from "./Subjects";

interface TicketCreatedEvent {
    subject: Subjects.TickerCreated
    data: {
        id: string,
        title: string,
        price: number
    }
}

export {
    TicketCreatedEvent,
};

