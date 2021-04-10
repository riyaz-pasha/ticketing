import { OrderCreatedEvent, Publisher, Subjects } from "@riyazpasha/ticketing-common";

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

export {
    OrderCreatedPublisher,
};
