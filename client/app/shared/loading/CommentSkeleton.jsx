const CommentSkeleton = () => {
  return (
      <div className="ml-4 border-l pl-2 border-border flex gap-2 py-2 bg-card/80 rounded-lg animate-pulse">
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-foreground/30 animate-pulse">
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <p className="text-sm font-semibold h-4 w-20 rounded-xs bg-foreground/30 animate-pulse"></p>
            <p className="text-xs text-text  h-4 w-20 rounded-xs bg-foreground/30 animate-pulse"></p>
          </div>
          <p className="text-sm bg-foreground/30 h-5 w-50 mt-2 animate-pulse"></p>
          <div className="flex gap-10 items-center mt-2">
              <span className="flex gap-1 items-center justify-center cursor-pointer animate-pulse h-4 w-8 bg-foreground/30">
              </span>
              <span className="flex gap-1 items-center justify-center cursor-pointer animate-pulse h-4 w-8 bg-foreground/30">
              </span>
              <span className="flex gap-1 items-center justify-center cursor-pointer animate-pulse h-4 w-8 bg-foreground/30">
              </span>
          </div>
        </div>
      </div>
  )
}

export default CommentSkeleton;