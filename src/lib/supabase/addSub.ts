"use server";

import { getServerSession } from "next-auth";
import { SubredditInfo } from "../reddit/getSearchSubs";
import { createClient } from "./server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function addSub(selectedSubreddit: SubredditInfo) {
  const session = await getServerSession(authOptions);
  const supabase = await createClient();
  const { error } = await supabase.from("reddit_followed").insert([
    {
      sub: selectedSubreddit.name,
      email: session?.user?.email,
      img: selectedSubreddit.icon,
      subId: selectedSubreddit.id,
    },
  ]);
  revalidatePath("/");
  if (error) notFound();
}
