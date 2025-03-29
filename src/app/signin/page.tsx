import GoogleSignInButton from "@/components/GoogleSignInButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <GoogleSignInButton />
    </div>
  );
}
