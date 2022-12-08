

import { Form, Link, useTransition , useLoaderData} from "@remix-run/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Label, Input, ErrorMessage, Button } from "~/components/formElements";
import { getSession } from "~/sessions.server.js";


/* export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId")
  const db = connectDb();
  const users = await db.models.User.find( {_id : userId} );
  return userId
  
} */

/* export async function loader({ params }) {
  // Our session cookie is HTTPOnly, so we have to read it on the server and
  // return it to the client as loader data
  const db = connectDb();
  const user = await db.models.User.findById(params.userId);
  return json(user);
} */
export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  userId = session.get("userId")
  const db = connectDb();
  const username = await db.models.User.findOne({_id : userId});
  const newuserName = username.username ;
  console.log(newuserName);
  return (newuserName);
}



export default function RoomForm({
  action,
  errors,
  defaultValues,
  submittedValues,
  cancelLink,
}) {
  const transition = useTransition();
  const newuserName = useLoaderData();
   /* const user = useLoaderData();
  const { userId } = useLoaderData();
  const newUserId = userId; */
/*  console.log(newuserName) 
 */    return (
    <Form method="post" action={action}>
      <fieldset disabled={transition.state === "submitting"}>
        <Label htmlFor="name">Name</Label>
        <textarea
          name="name"
          placeholder="Name"
          className="mb-3"
          defaultValue={submittedValues?.content ?? defaultValues?.content}
        />
        <Input
          type="text"
          name="username"
          placeholder="Username"
          className="mb-3"
          defaultValue={newuserName}
        />

        <div className="mt-4 flex flex-row gap-3">
          <Button type="submit">
            {transition.state === "submitting" ? (
              <span className="flex flex-row items-center gap-2">
                Saving <ArrowPathIcon className="h-4 w-4 animate-spin" />
              </span>
            ) : (
              "Save"
            )}
          </Button>
          {cancelLink && (
            <Link
              to={cancelLink}
              className="order-first rounded border border-slate-300 py-2 px-3"
            >
              Cancel
            </Link>
          )}
        </div>
      </fieldset>
    </Form>
  );
}




/* import { Form, Link, useTransition , useLoaderData} from "@remix-run/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Label, Input, ErrorMessage, Button } from "~/components/formElements";
import { getSession } from "~/sessions.server.js";


export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({ userId: session.get("userId") });
}




export default function RoomForm({
  action,
  errors,
  defaultValues,
  submittedValues,
  cancelLink,
}) {
  const transition = useTransition();

  return (
    <Form method="post" action={action}>
      <fieldset disabled={transition.state === "submitting"}>
        <Label htmlFor="name">Name</Label>
        <textarea
          name="name"
          placeholder="Name"
          className="mb-3"
          defaultValue={submittedValues?.name ?? defaultValues?.name}
        />
        
        <ErrorMessage>{errors?.name?.message}</ErrorMessage>
        <Label htmlFor="floor">Floor</Label>
        <Input
          type="text"
          name="floor"
          placeholder="Floor"
          defaultValue={submittedValues?.floor ?? defaultValues?.floor ?? 0}
          className="mb-3"
        />
        
        <ErrorMessage>{errors?.floor?.message}</ErrorMessage>

        <Label htmlFor="facilities.screen">
          <Input
            type="checkbox"
            name="facilities.screen"
            className="mr-2 inline-block align-middle"
            defaultChecked={
              submittedValues?.facilities?.screen ??
              defaultValues?.facilities?.screen
            }
          />{" "}
          TV screen
        </Label>
        <ErrorMessage>{errors?.["facilities.screen"]?.message}</ErrorMessage>

        <Label htmlFor="facilities.projector" className="mb-3">
          <Input
            type="checkbox"
            name="facilities.projector"
            className="mr-2 inline-block align-middle"
            defaultChecked={
              submittedValues?.facilities?.projector ??
              defaultValues?.facilities?.projector
            }
          />{" "}
          Projector
        </Label>
        <ErrorMessage>{errors?.["facilities.projector"]?.message}</ErrorMessage>

        <Label htmlFor="facilities.seatCount">Seat count</Label>
        <Input
          type="number"
          name="facilities.seatCount"
          defaultValue={
            submittedValues?.facilities?.seatCount ??
            defaultValues?.facilities?.seatCount ??
            30
          }
          className="mb-3"
        />
        <ErrorMessage>{errors?.["facilities.seatCount"]?.message}</ErrorMessage>

        <div className="mt-4 flex flex-row gap-3">
          <Button type="submit">
            {transition.state === "submitting" ? (
              <span className="flex flex-row items-center gap-2">
                Saving <ArrowPathIcon className="h-4 w-4 animate-spin" />
              </span>
            ) : (
              "Save"
            )}
          </Button>
          {cancelLink && (
            <Link
              to={cancelLink}
              className="order-first rounded border border-slate-300 py-2 px-3"
            >
              Cancel
            </Link>
          )}
        </div>
      </fieldset>
    </Form>
  );
}
 */