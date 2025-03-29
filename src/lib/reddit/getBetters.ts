import type { Session } from "next-auth";
import { getSubs } from "../supabase/getSubs";
import { notFound } from "next/navigation";
import type { BestPosts, Post } from "@/types/reddit";

export async function getBetters(session: Session): Promise<BestPosts[]> {
  const bestPosts: BestPosts[] = [];
  const { error, data } = await getSubs(session);
  if (error) return notFound();

  for (const sub of data!) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/top.json?t=week&limit=6`
      );
      const json = await res.json();

      const posts = json.data.children.map((post: { data: Post }) => ({
        title: post.data.title,
        selftext: post.data.selftext,
        id: post.data.id,
        thumbnail: post.data.thumbnail,
        url: post.data.url,
        is_self: post.data.is_self,
        preview: post.data.preview,
      }));

      bestPosts.push({ sub, posts });
    } catch (error) {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/top.json?t=week&limit=6`
      );
      const text = await res.text();
      console.error(`Error fetching posts for subreddit ${sub}:`, error);
      console.error("complete text:", text);
    }
  }

  return bestPosts;
}
