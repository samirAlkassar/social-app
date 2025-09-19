import Image from "next/image"
import { useUserContext } from "@/app/context/useUser"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"
export const Stories = () => {
    const [xcoor, setXcoor] = useState(0);

    return (
        <div className="relative bg-card mb-2 sm:mt-4 mt-0 p-2 rounded-xl overflow-x-scroll scroll-hidden no-scrollbar max-w-screen">

            <div className="flex ga-1 transform translate-all duration-300" style={{transform: `translate(-${xcoor}px,0px)`}}>
                <AddStory />
                <Story />
                <Story />
                <Story />
                <Story />
                <Story />
                <Story />
                <Story />
            </div>
            {xcoor > 100 && <button onClick={()=>{setXcoor(xcoor - 270)}} className="absolute hidden sm:block left-2 top-20 bg-background/80 rounded-full p-3 cursor-pointer">
                <ChevronLeft />
            </button>}
            <button onClick={()=>{setXcoor(xcoor + 270)}} className="absolute hidden sm:block right-2 top-20 bg-background/80 rounded-full p-3 cursor-pointer">
                <ChevronRight />
            </button>
        </div>
    )
}

const AddStory = () => {
    return (
        <div className="sm:min-w-28 sm:h-50 min-w-24 h-40 bg-accent rounded-xl border-2 border-border flex flex-col gap-1 justify-center items-center relative cursor-pointer">
            <div className="bg-card rounded-full p-2 z-20">
                <Plus size={28} className="text-accent"/>
            </div>
            <h1 className="bottom-12 text-sm font-bold text-background">Add Story</h1>
            
        </div>
    )
}

const Story = () => {
    const {user} = useUserContext();
    return (
            <div className="relative sm:min-w-28 min-w-24 sm:h-50 h-40 rounded-xl overflow-clip border-2 border-border cursor-pointer"> 
                <Image 
                    src={"https://i.pinimg.com/736x/9a/1b/dc/9a1bdcbf1346e2ef8a8968c509faa587.jpg"}
                    alt="story" 
                    fill 
                    className="object-cover absolute hover:scale-[102%] transition-all duration-75"/>
                <div className="absolute bg-linear-0 from-black/40 to-transparent w-full h-full" />

                <div className="absolute top-1 left-1">
                    <div className="relative w-8 h-8 overflow-clip rounded-full border-2 border-primary">
                        <Image 
                            src={user?.picturePath || "/images/profile-avatar-notfound.jpg"} 
                            alt="User Image"
                            fill
                            className="object-cover absolute"/>
                    </div>
                </div>

                <h1 className="absolute bottom-1 right-1 text-white sm:text-sm text-xs">{user?.firstName || "user"} {user?.lastName || "name"}</h1>
            </div>
    )
}

