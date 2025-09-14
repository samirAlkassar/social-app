const FriendsSkeleton = () => {
    return (
        <div className="flex items-center justify-between px-2 py-1 rounded-xl animate-pulse">
            <div className="flex items-center gap-2">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-secondary"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-secondary bg-secondary"></div>
                </div>

                <div>

                    <div className="w-18 h-4 bg-secondary rounded mb-2"></div>
                    <div className="w-10 h-3 bg-secondary rounded"></div>
                </div>
            </div>  
            <div className="flex gap-2">
                <div className="w-8 h-8 bg-secondary rounded-lg"></div>
                <div className="w-8 h-8 bg-secondary rounded-lg"></div>
            </div>
        </div>
    )
}

export default FriendsSkeleton;