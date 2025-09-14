"use client";

import React, { useState, useEffect } from 'react';
import { useUserContext } from "@/app/context/useUser"; 
import {UserFeed} from "@/app/shared/components/UserFeed";
import { Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, Palette, Shield, Bell, Eye, Moon, Sun, Monitor,Globe} from 'lucide-react';
import { Navbar } from '@/app/shared/components/Navbar';
import { useParams } from 'next/navigation'

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState('light');
  const [privacy, setPrivacy] = useState('public');
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [totalLikes, setTotalLikes] = useState(null);
  const params = useParams()

  
  const [notifications, setNotifications] = useState({likes: true, comments: true, follows: true, messages: false});
  useEffect(() => {
    const total = userPosts.reduce((sum, post) => sum + (Object.values(post?.likes || {}).length || 0), 0);
    setTotalLikes(total);
  }, [userPosts]);

  const defaultProfileData = {
    phone: '(+20) 1090990909',
    bio: '',
    location: 'city, state',
    website: 'liamcrosswebsite.com',
    birthDate: '',
  };
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [mounted, setMounted] = useState(false);
  const [tempData, setTempData] = useState(profileData);


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
      setUser(user)
    } catch (error) {
    console.log(error);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    console.log("Params:", params);
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

  const handleEdit = () => {
    if (isEditing) {
      setTempData(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const stats = {
    posts: 156,
    followers: 1248,
    following: 892,
    likes: 5420
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

 
  
  const ProfileInfo = () => (
    
    <div className="space-y-6">
      {/* Cover Photo */}
      <div className="relative">
        <img 
          src={user?.panner || "https://i.pinimg.com/1200x/39/7b/cf/397bcf602e03e5fc204f212d0afac70e.jpg"}
          alt="Cover"
          className="w-full sm:h-40 h-30 object-cover sm:rounded-xl rounded-lg"
        />
        {isEditing && (
          <button className="absolute top-4 right-4 p-2 bg-forground text-text rounded-lg hover:bg-forground/70 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        )}
        
        {/* Profile Picture */}
        <div className="absolute sm:-bottom-16 -bottom-12 left-6">
          <div className="relative">
            <img 
              src={user?.picturePath ? user?.picturePath : "../images/profile-avatar-notfound.jpg"}
              alt="Profile"
              className="sm:w-32 sm:h-32 w-25 h-25 rounded-full border-4 border-black shadow-lg object-cover"
            />
            {isEditing && (
              <button className="absolute bottom-2 right-2 p-2 bg-card text-text rounded-full hover:bg-card transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="sm:pt-14 pt-8 sm:px-0 px-3 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={tempData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={tempData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    placeholder="Last Name"
                  />
                </div>
                <textarea
                  value={tempData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 h-20 resize-none"
                  placeholder="Bio"
                />
              </div>
            ) : (
              <div>
                <h1 className="sm:text-3xl text-2xl font-bold text-text sm:mb-2 mb-1">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-text/90 leading-relaxed">{user?.bio || "User Bio: updat your user bio here"}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 ml-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-card text-text rounded-lg hover:bg-card transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 border border-border text-text rounded-lg hover:bg-secondary-hover transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 sm:px-4 sm:py-2 px-3 py-1.5 bg-foreground text-background rounded-lg hover:bg-foreground/80 cursor-pointer transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-secondary-hover/20 rounded-xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-text">{userPosts?.length ? userPosts?.length : "..."}</div>
            <div className="text-sm text-text">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text">{user?.frinds?.length ? user?.frinds?.length : "..."}</div>
            <div className="text-sm text-text">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text">{user?.frinds?.length ? user?.frinds?.length : "..."}</div>
            <div className="text-sm text-text">Following</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text">{totalLikes}</div>
            <div className="text-sm text-text">Likes</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="sm:text-lg text-md font-semibold text-text/90">Contact Information</h3>
          <div className="space-y-2">
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-text-meuted" />
                  <input
                    type="email"
                    value={tempData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-text-meuted" />
                  <input
                    type="tel"
                    value={tempData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-text-meuted" />
                  <input
                    type="text"
                    value={tempData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-text-meuted" />
                  <input
                    type="text"
                    value={tempData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    placeholder="Website"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 text-text/80">
                  <Mail className="w-5 h-5 text-text-meuted" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-text/80">
                  <Phone className="w-5 h-5 text-text-meuted" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-text/80">
                  <MapPin className="w-5 h-5 text-text-meuted" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-3 text-text/80">
                  <Globe className="w-5 h-5 text-text-meuted" />
                  <a href={`https://${profileData.website}`} className="text-blue-600 hover:underline">
                    {profileData.website}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-text/80">
                  <Calendar className="w-5 h-5 text-text-meuted" />
                  <span>Joined {profileData.birthDate}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsPanel = () => (
    <div className="space-y-6">
      {/* Theme Settings */}
      <div className="bg-secondary border border-border rounded-xl p-4">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Theme Settings
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-text">Appearance</span>
            <div className="flex gap-2">
              {[
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'auto', icon: Monitor, label: 'Auto' }
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === value 
                      ? 'bg-card text-text' 
                      : 'bg-secondary text-text hover:bg-secondary'
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-secondary border border-border rounded-xl p-4">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-text">Profile Visibility</span>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="px-3 py-2 border border-border cursor-pointer rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text">Show Online Status</span>
            <button className="p-2 rounded-lg bg-secondary hover:bg-secondary transition-colors">
              <Eye className="w-4 h-4 text-text" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-secondary border border-border rounded-xl p-4">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h3>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-text capitalize">{key}</span>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !enabled }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  enabled ? 'bg-text' : 'bg-text-muted'
                }`}
              >
                <div className={`w-5 h-5 rounded-full transition-transform ${
                  enabled ? 'translate-x-6 bg-primary' : 'translate-x-1 bg-card'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!user) {return(
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text mb-4">User Not Found</h2>
        <p className="text-text">The profile you are looking for does not exist.</p>
      </div>
    </div>
  )}

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-background max-w-2xl mx-auto">
      <div className="max-w-4xl mx-auto sm:px-4 px-0 py-4">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-2">
          <div className="bg-card rounded-xl p-1 border border-border">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-12 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-primary text-text font-semibold'
                    : 'text-text hover:bg-secondary'
                }`}
              >
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-12 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-primary text-text font-semibold'
                    : 'text-text hover:bg-secondary'
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card sm:rounded-xl border border-border sm:p-6 p-2">
          {activeTab === 'profile' ? <ProfileInfo /> : <SettingsPanel />}
        </div>
      </div>

      <UserFeed 
        loadingPosts={loadingPosts} 
        setLoadingPosts={setLoadingPosts} 
        userPosts={userPosts} 
        setUserPosts={setUserPosts}/>

    </div>
    </>
  );
};

export default Profile;