import { PaymentCreatedEvent, Publisher, Subjects } from "@riyazpasha/ticketing-common";

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

export {
    PaymentCreatedPublisher,
};
