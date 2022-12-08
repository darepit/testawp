import { useLoaderData, Outlet, NavLink, useCatch } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { TvIcon, LightBulbIcon, UsersIcon } from "@heroicons/react/24/outline";
import floors from "~/config/floors";
import { json} from "@remix-run/node";
import { useState } from "react";


export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p> You got an error in your users page, sorry!</p>
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
      <p>It appears this user does not exist</p>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}
export async function loader() {
  const db = connectDb();
  const users = await db.models.User.find({_id : "638f0fbbee6ece58f394dce6"});
  console.log(users)
  return json(users);
 }


export default function Index() {
  const [filterTerm, setFilterTerm] = useState("");
  const users = useLoaderData();
  const filteredUsers = filterTerm ? filterUsers(users, filterTerm) : users;
  const sortedUsers = filteredUsers.sort((a, b) => {
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
        {filteredUsers.length > 0 ? (
          <ul className="rounded border border-slate-200 bg-white shadow-sm">
            {sortedUsers.map((user) => {
              return (
                <li key={user._id} className="border-b border-slate-200">
                  <NavLink
                    to={`/users/${user._id}`}
                    className={({ isActive }) =>
                      [
                        "block bg-white p-3 transition-colors",
                        isActive ? "bg-amber-100" : "hover:bg-amber-50",
                      ].join(" ")
                    }
                  >
                    <span className="blockfont-semibold mb-1">{user.username} , {user._id}</span>
                    <span className="flex flex-row items-center gap-2 text-sm text-slate-400">
                      {floors[user.floor]}
                  
                      {user.facilities?.screen && (
                        <TvIcon className="h-4 w-4" />
                      )}
                      {user.facilities?.projector && (
                        <LightBulbIcon className="h-4 w-4" />
                      )}
                      {user.facilities?.seatCount && (
                        <span className="flex flex-row items-center gap-1">
                          <UsersIcon className="h-4 w-4" />
                          {user.facilities.seatCount}
                        </span>
                      )}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        ) : null}
        {filteredUsers.length !== users.length ? (
          <p className="mt-3 text-center text-sm text-slate-400">
            Showing {filteredUsers.length} of {users.length}
          </p>
        ) : null}
      </div>


      
      <Outlet />
    </div>
  );
}

function filterUsers(users, filterTerm) {
  const sanitizedFilterTerm = filterTerm.trim().toLowerCase();
  return users.filter((user) => {
    // If the filter term is "screen" or "tv", show only users with a screen
    if (["screen", "tv"].some((term) => term.startsWith(sanitizedFilterTerm))) {
      return user.facilities?.screen;
    }

    // If the filter term is "projector", show only users with a projector
    if ("projector".startsWith(sanitizedFilterTerm)) {
      return user.facilities?.projector;
    }

    // If the filterTerm is a whole number, we'll assume it's a (minimum) seat count
    if (Number.isInteger(Number(sanitizedFilterTerm))) {
      return user.facilities?.seatCount >= Number(sanitizedFilterTerm);
    }

    // Otherwise, we'll check if it matches the floor name
    if (
      Object.values(floors).some((floor) =>
        floor.toLowerCase().startsWith(sanitizedFilterTerm)
      )
    ) {
      return (
        user.floor ==
        Object.keys(floors).find((key) =>
          floors[key].toLowerCase().startsWith(sanitizedFilterTerm)
        )
      );
    }

    // Or if none of the above, filter by title
    return user.name.toLowerCase().includes(sanitizedFilterTerm);
  });
}
