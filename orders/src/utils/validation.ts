import mongoose from 'mongoose';

const isValidTicketId = (ticketId: string) => {
    return mongoose.Types.ObjectId.isValid(ticketId);
}


export {
    isValidTicketId,
};
