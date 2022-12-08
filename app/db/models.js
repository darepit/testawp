import { mongoose } from "mongoose";

const { Schema } = mongoose;

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: String,
      required: true,
    },
    facilities: {
      screen: Boolean,
      projector: Boolean,
      seatCount: {
        type: Number,
        min: 0,
        max: 50,
        required: true,
      },
    },
    username: {
      type: String,
    },
  },
  { timestamps: true }
);



const subscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    expirationTime: Number,
    keys: {
      auth: {
        type: String,
        required: true,
      },
      p256dh: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
  type : String,
  trim : true,
  },
    certainDeletedRooms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
);


const postSchema = new Schema({
  author: {
    type: String,
    trim: true,
  },
  content: {
      type: String,
      required: true,
      max: 500,
  },
  likes: {
    type: Array,
    default: []
}
},
  { timestamps: true }
)


export const models = [
  {
    name: "Room",
    schema: roomSchema,
    collection: "rooms",
  },
  {
    name: "Subscription",
    schema: subscriptionSchema,
    collection: "subscriptions",
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  }, {
    name: "Post",
    schema: postSchema,
    collection: "posts",
  },
  
];


