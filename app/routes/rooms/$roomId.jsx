import { Form, Link, useLoaderData, useCatch } from "@remix-run/react";
import {
  TvIcon,
  LightBulbIcon,
  UsersIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import floors from "~/config/floors";

export async function loader({ params }) {
  const db = connectDb();
  const room = await db.models.Room.findById(params.roomId);
  if (!room) {
    throw new Response("Could not find the room you were looking for", {
      status: 404,
    });
  }
  return json(room);
}

export async function action({ request, params }) {
  const formData = await request.formData();
  if (formData.get("_action") === "delete") {
    const db = connectDb();
    const deletedRoom = await db.models.Room.findByIdAndDelete(params.roomId);
    return redirect("/rooms");
  }
  return null;
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p> The room doesn't exist!</p>
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
      <p>It appears this room does not exist</p>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

export default function RoomPage() {
  const room = useLoaderData();
  const iconClasses = "mr-2 inline-block h-5 w-5 align-middle";
  return (
    <div>
      <div className="flex flex-row">
        <h1 className="mb-1 flex-grow text-2xl font-bold">{room.name}</h1>
        <Link
          to={`/rooms/${room._id}/edit`}
          className="p-2 text-slate-400 hover:text-amber-500"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </Link>
        <Form method="post">
          <button
            type="submit"
            name="_action"
            value="delete"
            className="pointer p-2 text-slate-400 hover:text-red-500"
            aria-label="Delete room"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </Form>
      </div>
      <h2 className="mb-3 text-lg text-slate-400">{floors[room.floor]}</h2>
      {room.facilities?.screen && (
        <p>
          <TvIcon className={iconClasses} /> Has a TV screen
        </p>
      )}
      {room.facilities?.projector && (
        <p>
          <LightBulbIcon className={iconClasses} /> Has a projector
        </p>
      )}
      {room.facilities?.seatCount && (
        <p>
          <UsersIcon className={iconClasses} /> Seats{" "}
          {room.facilities.seatCount}{" "}
          {room.facilities.seatCount === 1 ? "person" : "people"}
        </p>
      )}
    </div>
  );
}
