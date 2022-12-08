import { useLoaderData, Outlet, NavLink, useCatch } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { TvIcon, LightBulbIcon, UsersIcon } from "@heroicons/react/24/outline";
import floors from "~/config/floors";
import { json} from "@remix-run/node";
import { useState } from "react";
import { getSession } from "~/sessions.server.js";





export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p> You got an error in your posts page, sorry!</p>
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




export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  userId = session.get("userId")
  const db = connectDb();
  const username = await db.models.User.findOne({_id : userId});
  const avatar = username.avatar;
  const userpost = username.username;
  const posts = await db.models.Post.find();
  return [avatar, posts , userpost];
 }

export default function Index() {
  const [filterTerm, setFilterTerm] = useState("");
  const values = useLoaderData();
  const avatar = values[0];
  const posts =  values[1];
  const userpost = values[2];
  const filteredPosts = filterTerm ? filterPosts(posts, filterTerm) : posts;
  const sortedPosts = filteredPosts.sort((a, b) => {
    if (a.floor > b.floor) return 1;
    if (a.floor < b.floor) return -1;
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  });

  return (
    <div className="grid grid-cols-2 content-start gap-6">
      <div>
        <input
          type="search"
          className="mb-3 w-full rounded-md border border-slate-200 p-2 shadow-sm"
          placeholder="Filter by name, floor, facilities or seat count"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
        />
        {filteredPosts.length > 0 ? (
          <ul className="rounded border border-slate-200 bg-white shadow-sm">
            {sortedPosts.map((post) => {
              return (
                <li key={post._id} className="border-b border-slate-200">
                  <NavLink
                    to={`/posts/${post.author}/${post._id}`}
                    className={({ isActive }) =>
                      [
                        "block bg-white p-3 transition-colors",
                        isActive ? "bg-amber-100" : "hover:bg-amber-50",
                      ].join(" ")
                    }
                  >
                   
                    <span className="blockfont-semibold mb-1">  <img id="image" height="40px" width="40px" src={avatar}  /> {post.author}</span>
                    <br></br>
                    <span className="blockfont-semibold mb-1">{post.content}</span>
                    <span className="flex flex-row items-center gap-2 text-sm text-slate-400">
                    {post.createdAt} {userpost}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        ) : null}
        {filteredPosts.length !== posts.length ? (
          <p className="mt-3 text-center text-sm text-slate-400">
            Showing {filteredPosts.length} of {posts.length}
          </p>
        ) : null}
      </div>


      
      <Outlet />
    </div>
  );
}

function filterPosts(posts, filterTerm) {
  const sanitizedFilterTerm = filterTerm.trim().toLowerCase();
  return posts.filter((post) => {
    // If the filter term is "screen" or "tv", show only posts with a screen
    if (["screen", "tv"].some((term) => term.startsWith(sanitizedFilterTerm))) {
      return post.facilities?.screen;
    }

    // If the filter term is "projector", show only posts with a projector
    if ("projector".startsWith(sanitizedFilterTerm)) {
      return post.facilities?.projector;
    }

    // If the filterTerm is a whole number, we'll assume it's a (minimum) seat count
    if (Number.isInteger(Number(sanitizedFilterTerm))) {
      return post.facilities?.seatCount >= Number(sanitizedFilterTerm);
    }

    // Otherwise, we'll check if it matches the floor name
    if (
      Object.values(floors).some((floor) =>
        floor.toLowerCase().startsWith(sanitizedFilterTerm)
      )
    ) {
      return (
        post.floor ==
        Object.keys(floors).find((key) =>
          floors[key].toLowerCase().startsWith(sanitizedFilterTerm)
        )
      );
    }

    // Or if none of the above, filter by title
    return post.name.toLowerCase().includes(sanitizedFilterTerm);
  });
}
