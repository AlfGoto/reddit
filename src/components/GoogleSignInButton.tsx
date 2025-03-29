"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="bg-white text-black border px-4 py-2 rounded shadow hover:bg-gray-100"
    >
      Sign in with Google
    </button>
  );
}
