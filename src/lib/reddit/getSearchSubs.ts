"use server"

import { getAccessToken } from "./getToken";

export type SubredditInfo = {
  name: string;
  icon: string;
  id: string;
};

type Item = {
  display_name?: string;
  icon_img?: string;
  community_icon?: string;
  id: string;
};

export async function searchSubreddits(
  keyword: string
): Promise<SubredditInfo[]> {
  const token = await getAccessToken();

  const res = await fetch(
    `https://oauth.reddit.com/subreddits/search?q=${encodeURIComponent(
      keyword
    )}&limit=6`,
    {
      headers: {
        Authorization: `bearer ${token}`,
        "User-Agent": "AutoVeille/0.0.1 by u/AlfGoto",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Reddit API error: ${res.statusText}`);
  }

  const json = await res.json();

  const subreddits: SubredditInfo[] = json.data.children.map(
    (child: { data: Item }) => ({
      name: child.data.display_name,
      icon: child.data.icon_img || child.data.community_icon || "",
      id: child.data.id,
    })
  );

  return subreddits;
}
