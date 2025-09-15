"use client";

import React, { useState, useEffect } from 'react';
import {UserFeed} from "@/app/shared/components/UserFeed";
import { Navbar } from '@/app/shared/components/Navbar';
import { useParams } from 'next/navigation'
import { useUserContext } from '@/app/context/useUser';
import { ProfileInfo } from '@/app/shared/components/profile/ProfileInfo';
import { SettingsPanel } from '@/app/shared/components/profile/SettingsPanel';
import Bookmarks from '@/app/bookmarks/page';

const Profile = () => {
  const {user} = useUserContext();
  const [loading, setLoading] = useState(false);
  const [userById, setUserById] = useState()
  const [activeTab, setActiveTab] = useState('profile');
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const params = useParams();

  const Authorized = Boolean(user._id === userById?._id)
  const [mounted, setMounted] = useState(false);


  const getUser = async (id) => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to get user", res.status, errText);
        return;
      }
      const user = await res.json();
      setUserById(user.user)
    } catch (error) {
    console.log(error);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (params?.id) {
      getUser(params.id);
    }
  }, [params]);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null; // or loading skeleton
  }


if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex sm:gap-2 gap-1">
        <span className='sm:w-5 sm:h-5 w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:0ms]'/>
        <span className='sm:w-5 sm:h-5 w-4 h-4 bg-primary/90 rounded-full animate-bounce [animation-delay:100ms]'/>
        <span className='sm:w-5 sm:h-5 w-4 h-4 bg-primary/80 rounded-full animate-bounce [animation-delay:200ms]'/>
      </div>
    </div>
  );
}

if (!userById) {
  return(
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text mb-4">User Not Found</h2>
        <p className="text-text">The profile you are looking for does not exist.</p>
      </div>
    </div>
  )
}

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-background max-w-2xl mx-auto">
      <div className="max-w-4xl mx-auto sm:px-4 px-0 py-4">
        {/* Tab Navigation */}
        {Authorized && <div className="flex justify-center mb-2">
          <div className="bg-card rounded-xl p-1 border border-border">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-12 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-primary text-white/85 font-semibold'
                    : 'text-text hover:bg-secondary'
                }`}
              >
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-12 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-primary text-background/85 font-semibold'
                    : 'text-text hover:bg-secondary'
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>}


        {/* Content */}
        <div className="bg-card sm:rounded-xl border border-border sm:p-6 p-2">
          {activeTab === 'profile' 
          ? <ProfileInfo 
            userById={userById} 
            Authorized={Authorized} 
            userPosts={userPosts} /> 
          : <SettingsPanel />}
        </div>
      </div>

      {/* <UserFeed 
        loadingPosts={loadingPosts} 
        setLoadingPosts={setLoadingPosts} 
        userPosts={userPosts} 
        setUserPosts={setUserPosts}
        user={userById}/> */}
        <Bookmarks />
    </div>
    </>
  );
};

export default Profile;