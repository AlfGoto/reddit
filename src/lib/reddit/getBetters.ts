import type { Session } from "next-auth";
import { getSubs } from "../supabase/getSubs";
import { notFound } from "next/navigation";
import type { BestPosts, Post } from "@/types/reddit";

async function getAccessToken() {
  const authUrl = "https://www.reddit.com/api/v1/access_token";
  const {
    REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET,
    REDDIT_USERNAME,
    REDDIT_PASSWORD,
  } = process.env;

  const basicAuth = Buffer.from(
    `${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "your-user-agent",
    },
    body: new URLSearchParams({
      grant_type: "password",
      username: REDDIT_USERNAME!,
      password: REDDIT_PASSWORD!,
    }).toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to get access token: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  console.log(data)
  return data.access_token;
}

export async function getBetters(session: Session): Promise<BestPosts[]> {
  const bestPosts: BestPosts[] = [];
  const { error, data } = await getSubs(session);
  if (error) return notFound();

  const token = await getAccessToken();

  for (const sub of data!) {
    try {
      const res = await fetch(
        `https://oauth.reddit.com/r/${sub}/top.json?t=week&limit=6`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            "User-Agent": "AutoVeille/0.0.1 by u/AlfGoto", // Ensure this is unique and descriptive
          },
        }
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
        `https://oauth.reddit.com/r/${sub}/top.json?t=week&limit=6`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            "User-Agent": "AutoVeille/0.0.1 by u/AlfGoto", // Ensure this is unique and descriptive
          },
        }
      );
      const text = await res.text();
      console.warn("complete text received:", text);
      console.error(`Error fetching posts for subreddit ${sub}:`, error);
    }
  }

  return bestPosts;
}
