import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import RoomForm from "~/components/RoomForm";
import { useActionData, useCatch, useLoaderData } from "@remix-run/react";
import {getUsers} from "~/config/getuser";
import { getSession } from "~/sessions.server.js";



/* export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId")
  const db = connectDb();
  const users = await db.models.User.find( {_id : userId} );
  return users
} */





/* export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  // Our session cookie is HTTPOnly, so we have to read it on the server and
  // return it to the client as loader data
  return json({ userId: session.get("userId") });
} */

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  userId = session.get("userId")
   const db = connectDb();
  const username = await db.models.User.findOne({_id : userId});
  const newuserName = username.username ;
  
  return (newuserName);
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = {
    name: formData.get("name"),
    floor: formData.get("floor"),
    username: formData.get("username"),
    facilities: {
      screen: formData.has("facilities.screen"),
      projector: formData.has("facilities.projector"),
      seatCount: Number(formData.get("facilities.seatCount")),
    },
  };
  const db = connectDb();
  try {
    const newRoom = new db.models.Room(data);
    await newRoom.save();
    return redirect(`/rooms/${newRoom._id}`);
  } catch (error) {
    console.log(error);
    return json(error.errors);
  }
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p> Something went wrong creating the room</p>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Error</h1>
      <p>Something went wrong creating the room</p>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

export default function CreateRoom() {
  const actionData = useActionData();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Create rooms</h1>
      <RoomForm cancelLink="/rooms" errors={actionData} />
    </div>
  );
}
