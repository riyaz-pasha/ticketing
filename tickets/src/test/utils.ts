import mongoose from 'mongoose';

const getId = () => new mongoose.Types.ObjectId().toHexString();

export {
    getId,
};
