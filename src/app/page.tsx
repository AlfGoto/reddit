import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SubredditPosts from "@/components/SubRedditPosts";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return (
    <main className="container mx-auto px-4 py-6 md:py-8">
      <SubredditPosts session={session} />
    </main>
  );
}
