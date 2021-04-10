import { Ticket } from "../ticket";

it('should implements optimistic concurrency control', async (done) => {
    const ticket = Ticket.build({ title: "movie 1", price: 100, userId: "1234", });
    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance?.set({ price: 150 });
    secondInstance?.set({ price: 200 });

    await firstInstance?.save();

    try {
        await secondInstance?.save();
    } catch (error) {
        return done();
    }

    throw new Error("Should not reach here");
});

it('should update ticket version on save', async () => {
    const ticket = Ticket.build({ title: "movie 1", price: 100, userId: "1234", });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
});
