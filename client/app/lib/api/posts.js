import getCookies from "@/app/actions/getCookies";

export async function getComments(postId, page = 1, limit = 5) {
  const token = await getCookies("token");

  const res = await fetch(
    `http://localhost:3001/posts/${postId}/comments?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return res.json(); // returns { comments, pagination }
}

