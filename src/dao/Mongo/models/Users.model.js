import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name:{
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    Usuario: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isGithub: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['Admin', 'User','Premium'],
        default: 'User'
    },
    age: {
        type: Number
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Carts'
    },
    orders:{
        type:[{
            type: Schema.Types.ObjectId,
            ref: 'Orders'
        }],
        default:[]
    },
    resetToken: {
            token: String,
            expiration: Date,
        },
    documents: {
        type:[{
            name: String,
            reference: String,
        }],
        default:[],
    },

    last_connection: {
        type: Date,
        default: null 
        },

    avatar: {
        type: String,
        //default: faker.image.avatar(),
    },
});

export const UserModel = model('Users', UserSchema);
