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
  const post = await db.models.Post.findById(params.postId);
  if (!post) {
    throw new Response("Could not find the post you were looking for", {
      status: 404,
    });
  }
  return json(post);
}

export async function action({ request, params }) {
  const formData = await request.formData();
  if (formData.get("_action") === "delete") {
    const db = connectDb();
    const deletedPost = await db.models.Post.findByIdAndDelete(params.postId);
    return redirect("/posts");
  }
  return null;
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p> The post doesn't exist!</p>
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
      <p>It appears this post does not exist</p>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

export default function PostPage() {
  const post = useLoaderData();
  const iconClasses = "mr-2 inline-block h-5 w-5 align-middle";
  return (
    <div>
      {post.author}
      <div className="flex flex-row">
        
        <br></br>
        <h1 className="mb-1 flex-grow text-2xl font-bold">{post.content}</h1>
        <Link
          to={`/posts/${post._id}/edit`}
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
            aria-label="Delete post"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </Form>
      </div>
      <h2 className="mb-3 text-lg text-slate-400">{floors[post.floor]}</h2>
      {post.facilities?.screen && (
        <p>
          <TvIcon className={iconClasses} /> Has a TV screen
        </p>
      )}
      {post.facilities?.projector && (
        <p>
          <LightBulbIcon className={iconClasses} /> Has a projector
        </p>
      )}
      {post.facilities?.seatCount && (
        <p>
          <UsersIcon className={iconClasses} /> Seats{" "}
          {post.facilities.seatCount}{" "}
          {post.facilities.seatCount === 1 ? "person" : "people"}
        </p>
      )}
    </div>
  );
}
