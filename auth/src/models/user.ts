import { Document, model, Model, Schema } from 'mongoose';
import { Password } from '../services/password';

// an Interface that describes the properties that are required to create a new user
interface UserAttrs {
    email: string,
    password: string
}

// an Interface that describes the properties that a User Document has
interface UserDoc extends Document {
    email: string,
    password: string
}

// an Interface that describes the properties that a User Model has
interface UserModel extends Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
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

userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = model<UserDoc, UserModel>("User", userSchema);

export {
    User,
};
