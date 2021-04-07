import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./Subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

class TicketCreatedListner extends Listener<TicketCreatedEvent> {
    subject: Subjects.TickerCreated = Subjects.TickerCreated;
    queueGroupName: string = "payments-service";

    onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
        console.log("🚀  TicketCreatedListner ", data);

        msg.ack();
    }
}

export {
    TicketCreatedListner,
};
