function SkeletonBox({ className = '' }) {
  return <div className={`bg-gray-800/60 rounded-xl animate-pulse ${className}`} />;
}

export default SkeletonBox;
export { SkeletonBox as Skeleton };

export function BookCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <SkeletonBox className="aspect-[3/4] w-full rounded-none" />
      <div className="p-4 space-y-2">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />
        <SkeletonBox className="h-3 w-1/3" />
      </div>
    </div>
  );
}
