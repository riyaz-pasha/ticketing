import { Publisher } from "./base-publisher";
import { Subjects } from "./Subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

class TickerCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TickerCreated = Subjects.TickerCreated;
}

export {
    TickerCreatedPublisher,
};
