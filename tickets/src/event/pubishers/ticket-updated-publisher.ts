import { Publisher, Subjects, TicketUpdatedEvent } from "@riyazpasha/ticketing-common";

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

export {
    TicketUpdatedPublisher,
};
