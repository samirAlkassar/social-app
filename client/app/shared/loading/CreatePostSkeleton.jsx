const CreatPostSkeleton = () => {
    return (
        <div className="bg-card/80 w-full h-[180px] border border-border rounded-2xl p-6 shadow-sm mb-6 animate-pulse">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full border border-neutral-200/60 bg-foreground/30animate-pulse" />
            <div className="flex-1 px-4 py-3 rounded-xl bg-foreground/30animate-pulse w-full h-18" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-24 h-8 bg-foreground/30 rounded-lg animate-pulse"></div>
              <div className="w-24 h-8 bg-foreground/30rounded-lg animate-pulse"></div>
              <div className="w-24 h-8 bg-foreground/30rounded-lg animate-pulse"></div>
            </div>
            <div className="w-20 h-8 bg-foreground/30rounded-xl animate-pulse"></div>
          </div>
        </div>
    )
}

export default CreatPostSkeleton;