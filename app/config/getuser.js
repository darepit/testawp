import { mongoose } from "mongoose";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import RoomForm from "~/components/RoomForm";
import { useActionData, useCatch, useLoaderData } from "@remix-run/react";
import floors from "~/config/floors";
import { getSession } from "~/sessions.server.js";


/* export async function getUserById(username) {
    const userId = await User.findOne({ username }).exec();
    console.log("test")
    return userId;
  } */
/*  const User = mongoose.model("User", userSchema);
 
export async function getUsers() {
 const db = connectDb();
  const users1 = await db.models.User.find();
  return json(users1);
} */



const User = mongoose.model('User', UserSchema);

User.findOne({name: 'Mami'}, (err, user) => {
    if (err) {
        console.log(err);
    } else {
        console.log(user);
    }
});