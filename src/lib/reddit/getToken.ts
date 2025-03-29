export async function getAccessToken() {
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
  return data.access_token;
}
