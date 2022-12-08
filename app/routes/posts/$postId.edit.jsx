import { json, redirect } from "@remix-run/node";
import { useActionData, useCatch, useLoaderData } from "@remix-run/react";
import PostForm from "~/components/PostForm";
import connectDb from "~/db/connectDb.server";

export async function loader({ params }) {
  const db = connectDb();
  const post = await db.models.Post.findById(params.postId);
  return json(post);
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const db = connectDb();
  try {
    const post = await db.models.Post.findById(params.postId);
    post.content = formData.get("name");
    post.author = formData.get("username");
    await post.save();
    return redirect(`/posts/${params.postId}`);
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

export default function EditPost() {
  const actionData = useActionData();
  const post = useLoaderData();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Edit post</h1>
      <PostForm
        defaultValues={post}
        cancelLink={`/posts/${post._id}`}
        errors={actionData}
      />
    </div>
  );
}
