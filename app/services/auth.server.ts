import { Authenticator, LocalStrategy } from "remix-auth";
import { collectedNotes } from "~/services/cn.server";
import { sessionStorage } from "~/services/session.server";

export let authenticator = new Authenticator<{
  email: string;
  token: string;
}>(sessionStorage);

authenticator.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "token",
      loginURL: "/login",
    },
    async (email, token) => {
      let cn = collectedNotes(email, token);
      await cn.me(); // check if they are valid getting the user data
      return { email, token };
    }
  )
);
