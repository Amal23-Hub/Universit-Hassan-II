import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-96 bg-white border-r border-gray-200">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-gray-200 bg-white">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
