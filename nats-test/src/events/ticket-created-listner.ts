import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";

class TicketCreatedListner extends Listener {
    subject: string = "ticket:created";
    queueGroupName: string = "payments-service";

    onMessage(data: any, msg: Message): void {
        console.log("🚀  TicketCreatedListner ", data);

        msg.ack();
    }
}

export {
    TicketCreatedListner,
};
