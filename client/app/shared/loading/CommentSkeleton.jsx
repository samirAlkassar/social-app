const CommentSkeleton = () => {
  return (
      <div className="ml-4 border-l pl-2 border-neutral-200 flex gap-2 py-2 bg-neutral-100 rounded-lg animate-pulse">
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-neutral-300 animate-pulse">
        </div>
        <div>
          <div className="flex gap-2 items-center">
            <p className="text-sm font-semibold h-4 w-20 rounded-xs bg-neutral-300 animate-pulse"></p>
            <p className="text-xs text-neutral-500  h-4 w-20 rounded-xs bg-neutral-300 animate-pulse"></p>
          </div>
          <p className="text-sm bg-neutral-300 h-5 w-50 mt-2 animate-pulse"></p>
          <div className="flex gap-10 items-center mt-2">
              <span className="flex gap-1 items-center justify-center cursor-pointer animate-pulse h-4 w-8 bg-neutral-300">
              </span>
              <span className="flex gap-1 items-center justify-center cursor-pointer animate-pulse h-4 w-8 bg-neutral-300">
              </span>
              <span className="flex gap-1 items-center justify-center cursor-pointer animate-pulse h-4 w-8 bg-neutral-300">
              </span>
          </div>
        </div>
      </div>
  )
}

export default CommentSkeleton;