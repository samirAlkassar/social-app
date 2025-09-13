import {Mail, Edit3, Eye, Bookmark, Heart, Rss, MessageCircle, Settings, Bell  } from 'lucide-react';
import Image from 'next/image';
import { useBookmarksContext } from '@/app/context/useBookmarks';

export const ProfileSection = ({currentUser}) => {
    const {bookmarks} = useBookmarksContext();
    return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden h-fit min-w-[350px] hidden lg:block top-[105px] sticky">
      {/* Profile Header */}
      <div className="relative p-1">
        <div className='relative w-full h-32'>
          <Image 
            src={currentUser?.panner ? `${process.env.NEXT_PUBLIC_API_URL}/assets/${currentUser.panner}` : "https://i.pinimg.com/1200x/37/c6/8f/37c68ff0d0b664704990c337f9cddf4b.jpg"}
            alt="Cover"
            className="w-full object-cover rounded-lg"
            fill
          />
        </div>
        <div className="absolute -bottom-8 left-6">
          <div className="relative">
            <img 
                src={currentUser?.picturePath ? currentUser?.picturePath : "./images/profile-avatar-notfound.jpg"}
                alt={currentUser?.firstName}
                className="w-18 h-18 rounded-full border-2 border-border shadow-lg object-cover bg-neutral-200"
            />
            <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${true ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-10 px-6 pb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-2xl font-bold text-text">{currentUser?.firstName}{" "}{currentUser?.lastName}</h2>
            <p className="flex text-sm items-center gap-2 text-cyan-600">
              <Mail className="w-4 h-4" />
              {currentUser?.email}
            </p>
          </div>
          

        </div>

        <p className="text-text-muted mb-6">user bio</p>
          <div className="flex gap-2">
            <button className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm hover:bg-neutral-800 bg-neutral-700 cursor-pointer text-white rounded-lg transition-all duration-300"><Edit3 size={16}/>Edit</button>
            <button onClick={()=>{window.location.href = `/profile/${currentUser?.firstName}_${currentUser?.lastName}`}} className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm hover:bg-neutral-800 bg-neutral-700 cursor-pointer text-white rounded-lg transition-all duration-300"><Eye size={16}/>view</button>
          </div>
        {/* Stats */}
        <div className="flex justify-between items-center p-4 bg-card rounded-xl mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-text">999</div>
            <div className="text-xs text-text-muted">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text">999</div>
            <div className="text-xs text-text-muted">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text">999</div>
            <div className="text-xs text-text-muted">Following</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-2">
            <SettingsItem icon={Rss} label="Feed Preferences" />
            <SettingsItem icon={Bell} label="Notifications" />
            <SettingsItem icon={Bookmark} label="Saved Items" count={`${bookmarks.length}`} href="/bookmarks" />
            <SettingsItem icon={Heart} label="Likes" />
            <SettingsItem icon={MessageCircle} label="Messages" />
            <SettingsItem icon={Settings} label="Account Settings" />
        </div>
      </div>
    </div>
    )
};


const SettingsItem = ({icon: Icon, label, notification = "", count = "", href}) => (
  <div onClick={()=>{href && (window.location.href = href)}} className={`flex items-center gap-3 p-3 bg-gradient-to-r bg-secondary border border-border-muted rounded-xl hover:border-text-muted/20 hover:shadow-sm transition-all duration-300 cursor-pointer ${notification && "justify-between"}`}>
    <div className='flex items-center gap-3'>
      <Icon className="w-4 h-4 text-text" />
      <span className="font-medium text-sm text-text">{label}</span>
    </div>
    {notification && <span className='bg-red rounded-full max-w-4 max-h-4 text-sm p-[10px] flex items-center justify-center text-white'>{notification}</span>}
    {count && <p className="text-text text-sm -ml-2">{"("}{count}{")"}</p>}

  </div>
);