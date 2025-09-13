const FriendsSkeleton = () => {
    return (
        <div className="flex items-center justify-between px-2 py-1 rounded-xl animate-pulse">
            <div className="flex items-center gap-2">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-card"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card bg-secondary"></div>
                </div>

                <div>

                    <div className="w-18 h-4 bg-card rounded mb-2"></div>
                    <div className="w-10 h-3 bg-card rounded"></div>
                </div>
            </div>  
            <div className="flex gap-2">
                <div className="w-8 h-8 bg-card rounded-lg"></div>
                <div className="w-8 h-8 bg-card rounded-lg"></div>
            </div>
        </div>
    )
}

export default FriendsSkeleton;