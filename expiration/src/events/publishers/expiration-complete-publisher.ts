import { ExpirationCompleteEvent, Publisher, Subjects } from "@riyazpasha/ticketing-common";

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

export {
    ExpirationCompletePublisher,
};
