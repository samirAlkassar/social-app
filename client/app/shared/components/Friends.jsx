"use client";

import getCookies from "@/app/actions/getCookies";
import { MessageCircle, Users, Search, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserContext } from "@/app/context/useUser";
import FriendsSkeleton from "@/app/shared/loading/FriendsSkeleton";


export function FriendsSection() {
  const [friends, setFriends] = useState([]);
  const {user, loading} = useUserContext();
  const [loadingFriends, setLoadingFriends] = useState(false);

  useEffect(() => {
    const fetchPosts = async (id) => {
        try {
          setLoadingFriends(true);
            const token = await getCookies("token");
              if (!token?.value) {
                alert("You must be logged in to post.");
                return;
                }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/friends`,{
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${token?.value}`, 
                }
              }
            );
            if (!response.ok) throw new Error("Network response was not ok");
            return await response.json();
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        } finally {setLoadingFriends(false)}
    };
    if (user && user?._id) {
        fetchPosts(user?._id).then((data) => {
            setFriends(data);
        });
    }    
  }, [user?.frinds]);
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden h-fit min-w-[350px] hidden xl:block top-[105px] sticky">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-text flex items-center gap-2">
            <Users className="w-6 h-6 text-text" />
            Friends & Active
          </h2>
          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-text" />
          </button>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">
            {friends.filter((f) => f.isActive).length} Online
          </span>
          <span className="px-3 py-1 bg-secondary text-text rounded-full text-sm font-medium">
            {friends.length} Total Friends
          </span>
        </div>
      </div>

      {/* Friends List */}
      <div className="p-4">
        <div className="space-y-3">
          {loadingFriends
            ? Array.from({ length: 5 }).map((_, idx) => <FriendsSkeleton key={idx} />)
            : friends.map((friend) => (
                <FriendsItem key={friend._id} friend={friend} />
              ))}
        </div>
      </div>
    </div>
  );
}

const FriendsItem = ({ friend }) => (
  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
    <div className="flex items-center gap-2">
      <div className="relative">
        <img
          src={friend?.picturePath || "/images/profile-avatar-notfound.jpg"}
          alt={friend?.firstName}
          onError={(e) => {
            e.target.onerror = null; // prevent infinite loop
            e.target.src = "/images/profile-avatar-notfound.jpg";
          }}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-border ${
            true ? "bg-green-500" : "bg-gray-400"
          }`}
        ></div>
      </div>

      <div>
        <div className="font-medium text-text">{friend?.firstName}{" "}{friend?.lastName}</div>
        <div className="flex items-center gap-2 text-xs/snug text-text-muted">
          {true ? "Active" : `Last seen ${friend.lastSeen}`}
        </div>
      </div>
    </div>

    <div className="flex">
      <button className="p-1 hover:bg-secondary rounded-lg transition-colors cursor-pointer">
        <MessageCircle className="w-5 h-5 text-text" />
      </button>
      <button className="p-1 hover:bg-secondary rounded-lg transition-colors cursor-pointer">
        <MoreHorizontal className="w-5 h-5 text-text" />
      </button>
    </div>
  </div>
);

