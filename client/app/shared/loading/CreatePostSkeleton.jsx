const CreatPostSkeleton = () => {
    return (
        <div className="bg-white w-full h-[180px] border border-neutral-200/50 rounded-2xl p-6 shadow-sm mb-6 animate-pulse">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full border border-neutral-200/60 bg-neutral-200 animate-pulse" />
            <div className="flex-1 px-4 py-3 rounded-xl bg-neutral-200 animate-pulse w-full h-18" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200/50">
            <div className="flex items-center gap-3">
              <div className="w-24 h-8 bg-neutral-200 rounded-lg animate-pulse"></div>
              <div className="w-24 h-8 bg-neutral-200 rounded-lg animate-pulse"></div>
              <div className="w-24 h-8 bg-neutral-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="w-20 h-8 bg-neutral-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
    )
}

export default CreatPostSkeleton;