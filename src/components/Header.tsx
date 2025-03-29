import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import SignOutButton from "./SignOutButton";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="w-full flex items-center justify-between px-6 py-4">
      <p></p>

      {session ? (
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700 hidden sm:block">
            {session.user?.name}
          </p>

          {session.user?.image && (
            <Image
              src={session.user.image.split("=")[0]}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full"
              priority
            />
          )}

          <SignOutButton />
        </div>
      ) : null}
    </header>
  );
}
