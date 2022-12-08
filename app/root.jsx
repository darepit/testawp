import { UserCircleIcon } from "@heroicons/react/24/outline";
import { json } from "@remix-run/node";

import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
  useCatch,
  useLoaderData,
  Form,
} from "@remix-run/react";
import styles from "~/tailwind.css";
import { getSession } from "./sessions.server";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Project Elon",
    viewport: "width=device-width,initial-scale=1",
  };
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p> You got an error, sorry!</p>
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
      <p>Somthing went wrong</p>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    isAuthenticated: session.has("userId"),
  });
}
const express = require('express')
const router = express.Router()
router.get('/', function(req, res){
  var user_id = req.user.id
  console.log(user_id)
});  



export default function App() {
  const { isAuthenticated } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#F1F5F9" />
        <Links />
      </head>
      <body className="bg-slate-100 p-4 font-sans text-slate-800">
        <header className="mb-4 flex flex-row items-center gap-3 border-b-2 pb-3">
          <Link
            to="/"
            className="mr-auto block transition-colors hover:text-slate-600"
          >
            <h1 className="text-2xl font-bold"> Project Elon</h1>
          </Link>
          <MenuLink to="/posts/new">Add Post</MenuLink>
          {isAuthenticated ? (
            <>
              <MenuLink to="/settings" className="">
                       </MenuLink>
              <Form method="post" action="/logout">
                <button type="submit">Logout</button>
              </Form>
            </>
          ) : (
            <>
              <MenuLink to="/login" className="">
                Login
              </MenuLink>
              <MenuLink to="/signup" className="">
                Sign up
              </MenuLink>
            </>
          )}
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function MenuLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "font-semibold" : "font-normal")}
    >
      {children}
    </NavLink>
  );
}
