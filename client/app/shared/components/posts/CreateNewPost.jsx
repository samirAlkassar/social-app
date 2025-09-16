import Dropzone from "react-dropzone";
import { useUserContext } from "@/app/context/useUser"; 
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import getCookies from "@/app/actions/getCookies";
import { usePostsContext } from "@/app/context/usePosts.jsx";
import { XIcon, ImageIcon, MapPin, Laugh } from "lucide-react";
import Image from "next/image";

const CreateNewPost = () => {
    const {loading, user} = useUserContext();
    const {setPosts} = usePostsContext();
    const [description, setDescription] = useState("");
    const [loadingNewPost, setLoadingNewPost] = useState(false);
    const [picture, setPicture] = useState(null);
    const [openCreatePostMenu, setOpenCreatePostMenu] = useState(false);
    const router = useRouter();
    
    const createNewPost = async () => {
        try {
        setLoadingNewPost(true);
        const token = await getCookies("token");
        if (!token?.value) {
            alert("You must be logged in to post.");
            return;
            }
        const formData = new FormData();
        formData.append("userId", user?._id);
        formData.append("description", description);
        if (picture) {
            formData.append("image", picture);        
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
            method: "POST",
            headers: {
            "Authorization": `Bearer ${token?.value}`, 
            },
            body: formData,
            cache: "no-store" 
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Server response:", res.status, errorText);
            return;
        }

        const data = await res.json();
        setPosts(data);
        setOpenCreatePostMenu(false)

        } catch (error) {
        console.log(error);
        } finally {
        setDescription("");
        setPicture("");
        setLoadingNewPost(false);
        }
    };
    return (
        <>
        <div className="bg-card/80 backdrop-blur-md border border-border/50 sm:rounded-2xl sm:px-6 px-4 sm:py-2 py-2 sm:pt-3 pt-4 shadow-sm mb-6">
            <div className="flex items-start gap-3 mb-2">

                {loading ?
                    <div className="w-10 h-10 rounded-full border border-neutral-300/60 bg-neutral-300 animate-pulse" /> :
                    <img
                        src={user?.picturePath ? user?.picturePath : "/images/profile-avatar-notfound.jpg"}
                        alt={user?.fireName || "avatar image"}
                        className="w-10 h-10 rounded-full border border-neutral-200/60 cursor-pointer"
                        onClick={() => { router.push(`/profile/${user?.firstName}_${user.lastName}/${user?._id}`) }}
                    />
                }
                <button className="flex-1 px-4 py-2 cursor-pointer rounded-xl bg-secondary border border-border/60 placeholder-neutral-400 focus:outline-none text-left text-text-muted" onClick={()=>{setOpenCreatePostMenu(true)}}>
                    What's on your mind?
                </button>
            </div>

            <div className="flex items-center justify-between">
                <div className="grid grid-cols-3 w-full gap-2">


                    <button onClick={()=>{setOpenCreatePostMenu(true)}} className="flex justify-center items-center gap-2 px-3 py-3 rounded-lg hover:bg-secondary-hover text-text transition-all duration-200 text-sm cursor-pointer">
                        📷 Location
                    </button> 
                    <button onClick={()=>{setOpenCreatePostMenu(true)}} className="flex justify-center items-center gap-2 px-3 py-3 rounded-lg hover:bg-secondary-hover text-text transition-all duration-200 text-sm cursor-pointer">
                        📍 Location
                    </button>
                    <button onClick={()=>{setOpenCreatePostMenu(true)}} className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg hover:bg-secondary-hover text-text transition-all duration-200 text-sm cursor-pointer">
                        😊 Feeling
                    </button>
                </div>


            </div>
        </div>

        <div className={`fixed inset-0 z-10 flex items-center justify-center bg-black/50 transition-all duration-100 ease-in ${openCreatePostMenu? "opacity-100 visable" : "opacity-0 invisible"}`}>
                <div className={`p-4 pt-3 bg-card sm:rounded-xl w-lg transform transition-all duration-75 ease-in sm:h-fit flex flex-col rounded-t-xl 
                    ${openCreatePostMenu ? "sm:opacity-100 h-full sm:scale-100 sm:visable" : "sm:opacity-0 h-28 sm:scale-50 sm:invisible"}`}>
                    <div className="grid grid-cols-3 border-b border-border pb-1">
                        <span />
                        <h2 className="grid-3 text-center text-text text-xl items-center flex justify-center">Create new post</h2>
                        <div className="flex justify-end">
                            <button onClick={()=>{setOpenCreatePostMenu(false)}} className="hover:bg-secondary-hover flex items-center justify-center w-9 h-9 rounded-full cursor-pointer">
                                <XIcon size={22}/>
                            </button>
                        </div>
                    </div>

                    <div className="p-1 flex gap-2 pt-2">
                        <div className="relative w-10 h-10 rounded-full overflow-clip  border border-neutral-200/60 cursor-pointer">
                             <Image
                                src={user?.picturePath ? user?.picturePath : "/images/profile-avatar-notfound.jpg"}
                                alt={user?.fireName || "avatar image"} fill
                                className="absoulte w-full h-full object-cover"
                                onClick={() => { router.push(`/profile/${user?.firstName}_${user?.lastName}/${user?._id}`) }}
                            />
                        </div>
                        <div>
                            <h4 
                            onClick={() => { router.push(`/profile/${user?.firstName}_${user?.lastName}/${user?._id}`) }} 
                            className="text-text text-base/tight">
                                {user?.firstName} {user?.lastName}
                            </h4>
                            <select name="Friends" id="friends" className="text-xs bg-secondary-hover px-2 py-1 cursor-pointer rounded-md">
                                <option value="Friends">Friends</option>
                            </select>
                        </div>
                    </div>

                    <div className={`${picture ? "sm:h-15 h-full" : "sm:h-40 h-full"}`}>
                        <textarea
                            value={description}
                            onChange={(e)=>{setDescription(e.target.value)}}                            
                            placeholder="What's on your mind?"
                            className="flex-1 px-4 py-3 font-normal text-lg resize-none rounded-xl w-full h-full text-text placeholder-neutral-400 focus:outline-none"
                        />
                    </div>

                    {picture && (
                        <div className="flex justify-center">
                        <div className="relative w-full h-full mb-2">
                            <img
                            src={URL.createObjectURL(picture)}
                            alt="Profile preview"
                            className="object-cover rounded-xl border-4 border-white shadow-lg"
                            />
                            <button
                            type="button"
                            onClick={() => setPicture(null)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                            ×
                            </button>
                        </div>
                        </div>
                    )}
 

                    <div className="grid grid-cols-3 gap-2 mb-3">
                            <Dropzone
                                acceptedFiles=".jpg,.jpeg,.png"
                                multiple={false}
                                onDrop={(acceptedFiles) => setPicture(acceptedFiles[0])}>
                                {({ getRootProps, getInputProps }) => (
                                    <button
                                        {...getRootProps()}
                                        className="flex gap-2 items-center bg-primary/50 hover:bg-primary/40 rounded-lg p-1.5 cursor-pointer active:scale-[98%] justify-center">
                                        <input {...getInputProps()} name="image" />
                                                <ImageIcon size={20}/>
                                                <p>Add Image</p>
                                    </button>
                                )}
                            </Dropzone>

                        <button className="flex gap-2 items-center bg-red/50 hover:bg-red/40 rounded-lg p-1.5 cursor-pointer active:scale-[98%] justify-center">
                            <MapPin  size={20}/>
                            <p>Location</p>
                        </button>
                        <button className="flex gap-2 items-center bg-amber-400/50 hover:bg-amber-200 rounded-lg p-1.5 cursor-pointer active:scale-[98%] justify-center">
                            <Laugh  size={20}/>
                            <p>Add iamge</p>
                        </button>
                    </div>

                    <div className="w-full">
                        <button 
                            onClick={createNewPost} 
                            disabled={!description.trim()}
                            className="px-4 py-2 w-full bg-neutral-900 cursor-pointer hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200">
                            {loadingNewPost? "Posting..." : "Post"}
                        </button>
                    </div>
                </div>
        </div>
        </>
    )
}

export default CreateNewPost;