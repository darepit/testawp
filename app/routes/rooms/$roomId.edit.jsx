import { json, redirect } from "@remix-run/node";
import { useActionData, useCatch, useLoaderData } from "@remix-run/react";
import RoomForm from "~/components/RoomForm";
import connectDb from "~/db/connectDb.server";

export async function loader({ params }) {
  const db = connectDb();
  const room = await db.models.Room.findById(params.roomId);
  return json(room);
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const db = connectDb();
  try {
    const room = await db.models.Room.findById(params.roomId);
    room.name = formData.get("name");
    room.floor = Number(formData.get("floor"));
    const dbScreen = room.facilities.screen;
    room.facilities.screen = formData.has("facilities.screen");
    const dbProjector = room.facilities.projector;
    room.facilities.projector = formData.has("facilities.projector");
    const dbSeatCount = room.facilities.seatCount;
    room.facilities.seatCount = Number(formData.get("facilities.seatCount"));
    await room.save();
    
    // If the screen has been changed
    if (
      formData.has("facilities.screen") !== dbScreen ||
      formData.has("facilities.projector") !== dbProjector
    ) 
    return redirect(`/rooms/${params.roomId}`);
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
      <p> The edit didn't work</p>
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
      <p>The edit didn't work</p>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

export default function EditRoom() {
  const actionData = useActionData();
  const room = useLoaderData();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Edit room</h1>
      <RoomForm
        defaultValues={room}
        cancelLink={`/rooms/${room._id}`}
        errors={actionData}
      />
    </div>
  );
}
