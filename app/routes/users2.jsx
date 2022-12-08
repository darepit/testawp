
import { useLoaderData, Outlet, NavLink, useCatch, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { TvIcon, LightBulbIcon, UsersIcon } from "@heroicons/react/24/outline";
import floors from "~/config/floors";
import { json} from "@remix-run/node";
import { useState } from "react";
import { getSession } from "~/sessions.server.js";




export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  userId = session.get("userId")
  const db = connectDb();
  const username = await db.models.User.findOne({_id : userId});
  const newuserName = username.username ;
  console.log(newuserName)
  return (newuserName);
}



export default function Login() {
  const newuserName = useLoaderData();
/*   const { userId } = useLoaderData();
 */  /* console.log(userId)
   */
 console.log(newuserName)
  const newUserId = userId;
  return (
 
          <p>
            You are already logged in as user
            <code className="ml-2 inline-block rounded bg-black p-2 text-white">
              {newuserName}
            </code>
          </p>
    
  );
}




/* export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId")
  const db = connectDb();
  const users = await db.models.User.find( {_id : userId} );
  return json(users)
  
}


  export default function Index() {
    const users = useLoaderData();
    const myJSON = JSON.stringify(users);
   return (myJSON)
  }
   */
   



 /* 

export default function Index() {
  const users = useLoaderData();
 return (

  <ul className="ml-5 list-disc">
        {users.map((user) => {
          return (
            <li key={user._id}>
              <Link
                to={`/users/${user._id}`}
                className="text-blue-600 hover:underline"
              >
                {user.username}
              </Link>
            </li>
          );
        })}
      </ul>
  
)
}

  */