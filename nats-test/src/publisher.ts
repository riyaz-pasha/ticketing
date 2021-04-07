import nats from "node-nats-streaming";
import { TickerCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222"
});

stan.on("connect", async () => {
    console.log("🚀 publisher connected to the NATS");

    // const data = JSON.stringify({
    //     id: "123",
    //     title: "title",
    //     price: 100
    // })
    // stan.publish("ticket:created", data, () => {
    //     console.log("🚀 ticket:created published", data);
    // });

    const publisher = new TickerCreatedPublisher(stan);
    try {

        await publisher.publish({
            id: "456",
            title: "Movie 1",
            price: 150
        })
    } catch (err) {
        console.error(err);
    }

});
