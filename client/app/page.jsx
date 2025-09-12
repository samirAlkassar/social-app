import { Navbar } from "./shared/components/Navbar";
import { Posts } from "./shared/components/posts/Posts";

const limit = 10;

const fetchPosts = async () => {
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?limit=${limit}&page=1`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function Home() {
  const data = await fetchPosts();
  return (
    <div>
      <Navbar />
      <Posts data={data?.posts} pagination={data?.pagination} limit={limit}/>
    </div>
  );
}
