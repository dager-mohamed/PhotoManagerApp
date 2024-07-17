import { authOptions } from "@/auth";
import NextAuth from "next-auth";

export const { auth, handlers, signIn, signOut, unstable_update } =
  NextAuth(authOptions);

export const { GET, POST } = handlers;
