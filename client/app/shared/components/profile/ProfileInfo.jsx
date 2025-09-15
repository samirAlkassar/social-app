import Image from 'next/image';
import { Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

export const ProfileInfo = ({userById, Authorized, userPosts}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [totalLikes, setTotalLikes] = useState(null);
    const defaultProfileData = {
        phone: '(+20) 1090990909',
        bio: '',
        location: 'city, state',
        website: 'liamcrosswebsite.com',
        birthDate: '',
        };
    const [profileData, setProfileData] = useState(defaultProfileData);
    const [tempData, setTempData] = useState(profileData);

    useEffect(() => {
        const total = userPosts.reduce((sum, post) => sum + (Object.values(post?.likes || {}).length || 0), 0);
        setTotalLikes(total);
    }, [userPosts]);

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
    return (
        <div className="space-y-6">
            {/* Cover Photo */}
            <div className="relative">
                <img
                    src={userById?.panner || "https://i.pinimg.com/1200x/39/7b/cf/397bcf602e03e5fc204f212d0afac70e.jpg"}
                    alt="Cover"
                    className="w-full sm:h-40 h-30 object-cover sm:rounded-xl rounded-lg"
                />
                {isEditing && Authorized && (
                    <button className="absolute top-4 right-4 p-2 bg-forground text-text rounded-lg hover:bg-forground/70 transition-colors">
                        <Camera className="w-4 h-4" />
                    </button>
                )}

                {/* Profile Picture */}
                <div className="absolute sm:-bottom-16 -bottom-12 left-6">
                    <div className="relative sm:w-32 sm:h-32 w-24 h-24 rounded-full overflow-clip p-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                        <Image
                            src={userById?.picturePath ? userById?.picturePath : "/images/profile-avatar-notfound.jpg"}
                            alt="Profile" fill
                            className="object-cover absolute scale-95 rounded-full"
                        />
                        {isEditing && Authorized && (
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
                        {isEditing && Authorized ? (
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
                                    {userById?.firstName} {userById?.lastName}
                                </h1>
                                <p className="text-text/90 leading-relaxed">{userById?.bio || "User Bio: updat your user bio here"}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 ml-4">
                        {isEditing && Authorized ? (
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
                            (Authorized && <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 sm:px-4 sm:py-2 px-3 py-1.5 bg-foreground text-background rounded-lg hover:bg-foreground/80 cursor-pointer transition-colors"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </button>)
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
                        <div className="text-2xl font-bold text-text">{userById?.frinds?.length ? userById?.frinds?.length : "..."}</div>
                        <div className="text-sm text-text">Followers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-text">{userById?.frinds?.length ? userById?.frinds?.length : "..."}</div>
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
                        {isEditing && Authorized ? (
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
                                    <span>{userById?.email}</span>
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
    )
}


