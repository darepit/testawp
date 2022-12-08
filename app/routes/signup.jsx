import { Form, useActionData } from "@remix-run/react";
import { Label, Input, Button, ErrorMessage } from "~/components/formElements";
import connectDb from "~/db/connectDb.server.js";
import { json, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs"

export async function action({ request }) {
  const db = connectDb();
  const formData = await request.formData();
  const user = db.models.User;
  let data = Object.fromEntries(formData);
  if (data.password === "" || data.username === "") {
    return json(
      { errorMessage: "Please fill out all fields", values: data },
      { status: 400 }
    );
  }

  if (data.password !== data.passwordConfirm) {
    return json(
      { errorMessage: "Passwords do not match", values: data },
      { status: 400 }
    );
  } else {
    const hashedPassword = await bcrypt.hash(data.password.trim(), 10)
    const randomnumber = Math.random();
    const newUser = new user({
      username: data.username,
      avatar: data.avatar,
      password: hashedPassword,
    });
    await newUser.save();
    return redirect("/login");
  }
}

export default function SignUp() {
  const dataAction = useActionData();
  return (
    <div>
      <h1 className="mb-1 text-lg font-bold">SignUp</h1>
      <Form method="post">
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          //   defaultValue={actionData?.values?.username}
        />

        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          defaultValue={dataAction?.values?.password}
        />

        <Label htmlFor="passwordConfirm">Confirm Password</Label>
        <Input
          type="password"
          name="passwordConfirm"
          id="passwordConfirm"
          placeholder="Repeat Password"
          defaultValue={dataAction?.values?.passwordConfirm}
        />
        <br />
        <div class="grid-container">
        <div class="grid-item">
        <Input
            type="radio"
            name="avatar"
            className="mr-2 inline-block align-middle"
            value="https://avatars.dicebear.com/api/avataaars/:one.svg"
          />{" "}
             <img id="image" height="40px" width="40px" src=
              "https://avatars.dicebear.com/api/avataaars/:one.svg"
             />   
             </div>
             <div class="grid-item">

             <Input
            type="radio"
            name="avatar"
            className="mr-2 inline-block align-middle"
            value="https://avatars.dicebear.com/api/avataaars/:two.svg"
          />{" "}
             <img id="image" height="40px" width="40px" src=
              "https://avatars.dicebear.com/api/avataaars/:two.svg"
             /> 
             </div>
             <div class="grid-item">
             <Input
            type="radio"
            name="avatar"
            className="mr-2 inline-block align-middle"
            value="https://avatars.dicebear.com/api/avataaars/:three.svg"
          />
             <img id="image" height="40px" width="40px" src=
              "https://avatars.dicebear.com/api/avataaars/:three.svg"
             />    
             </div>
             <div class="grid-item">
        <Input
            type="radio"
            name="avatar"
            className="mr-2 inline-block align-middle"
            value="https://avatars.dicebear.com/api/avataaars/:one.svg"
          />
             <img id="image" height="40px" width="40px" src=
              "https://avatars.dicebear.com/api/avataaars/:one.svg"
             />   
             </div>
             <div class="grid-item">

             <Input
            type="radio"
            name="avatar"
            className="mr-2 inline-block align-middle"
            value="https://avatars.dicebear.com/api/avataaars/:two.svg"
          />
             <img id="image" height="40px" width="40px" src=
              "https://avatars.dicebear.com/api/avataaars/:two.svg"
             /> 
             </div>
             <div class="grid-item">
             <Input
            type="radio"
            name="avatar"
            className="mr-2 inline-block align-middle"
            value="https://avatars.dicebear.com/api/avataaars/:three.svg"
          />
             <img id="image" height="40px" width="40px" src=
              "https://avatars.dicebear.com/api/avataaars/:three.svg"
             />    
             </div>
             </div>



        <ErrorMessage>{dataAction?.errorMessage}</ErrorMessage>
        <br />
        <Button type="submit">Sign Up</Button>
      </Form>
    </div>
      
      


  );
}
