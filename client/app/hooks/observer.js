import { useEffect } from "react";

export default function useInfiniteScroll({ loading, hasMore, onLoadMore, offset = 100 }) {
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      if (window.innerHeight + document.documentElement.scrollTop + offset >= document.documentElement.scrollHeight) {
        onLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, onLoadMore, offset]);
}

