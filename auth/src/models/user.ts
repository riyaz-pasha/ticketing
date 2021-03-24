import { model, Model, Schema } from 'mongoose';

// an Interface that describes the properties that are required to create a new user
interface UserAttrs {
    email: string,
    password: string
}

// an Interface that describes the properties that a User Model has
interface UserModel extends Model<any> {
    build(attrs: UserAttrs): any;
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = model<any, UserModel>("User", userSchema);

export {
    User,
};
