const PostSkeleton = () => {
  return (
    <div className="bg-card/80 backdrop-blur-md border border-border rounded-2xl p-6 shadow-sm animate-pulse">
      {/* Post Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar skeleton */}
          <div className="w-10 h-10 rounded-full bg-foreground/30"></div>
          <div>
            {/* Name skeleton */}
            <div className="h-4 w-24 bg-foreground/30 rounded mb-1"></div>
            {/* Date/location skeleton */}
            <div className="h-3 w-32 bg-foreground/30 rounded"></div>
          </div>
        </div>
        
        {/* Action buttons skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-foreground/30 rounded-lg"></div>
          <div className="w-7 h-7 bg-foreground/30 rounded-lg"></div>
        </div>
      </div>

      {/* Post Content Skeleton */}
      <div className="mb-4">
        {/* Caption skeleton - multiple lines */}
        <div className="space-y-2 mb-3">
          <div className="h-4 w-full bg-foreground/30 rounded"></div>
          <div className="h-4 w-3/4 bg-foreground/30 rounded"></div>
          <div className="h-4 w-1/2 bg-foreground/30 rounded"></div>
        </div>
        
        {/* Image skeleton */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="w-full h-64 bg-foreground/30"></div>
        </div>
      </div>

      {/* Post Actions Skeleton */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4">
          {/* Like button skeleton */}
          <div className="flex items-center gap-2 px-3 py-1.5">
            <div className="w-4 h-4 bg-foreground/30 rounded"></div>
            <div className="w-6 h-4 bg-foreground/30 rounded"></div>
          </div>
          
          {/* Comment button skeleton */}
          <div className="flex items-center gap-2 px-3 py-1.5">
            <div className="w-4 h-4 bg-foreground/30 rounded"></div>
            <div className="w-6 h-4 bg-foreground/30 rounded"></div>
          </div>
          
          {/* Share button skeleton */}
          <div className="flex items-center gap-2 px-3 py-1.5">
            <div className="w-4 h-4 bg-foreground/30 rounded"></div>
            <div className="w-10 h-4 bg-foreground/30 rounded"></div>
          </div>
        </div>
        
        {/* Bookmark button skeleton */}
        <div className="w-7 h-7 bg-foreground/30 rounded-lg"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;