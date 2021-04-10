import { OrderCancelledEvent, Publisher, Subjects } from "@riyazpasha/ticketing-common";

class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

export {
    OrderCancelledPublisher,
};
