import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"

export default function DemandesManagementLoading() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Skeleton */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex-1 max-w-md mx-8">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="w-full">
            {/* Page Header */}
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>

            <div className="space-y-8">
              {/* Main Table Card */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-80" />
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4">
                            <Skeleton className="h-4 w-16" />
                          </th>
                          <th className="text-left py-3 px-4">
                            <Skeleton className="h-4 w-20" />
                          </th>
                          <th className="text-left py-3 px-4">
                            <Skeleton className="h-4 w-24" />
                          </th>
                          <th className="text-left py-3 px-4">
                            <Skeleton className="h-4 w-32" />
                          </th>
                          <th className="text-center py-3 px-4">
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </th>
                          <th className="text-center py-3 px-2">
                            <Skeleton className="h-4 w-16 mx-auto" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(3)].map((_, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="py-3 px-4">
                              <Skeleton className="h-4 w-8" />
                            </td>
                            <td className="py-3 px-4">
                              <Skeleton className="h-6 w-16" />
                            </td>
                            <td className="py-3 px-4">
                              <Skeleton className="h-4 w-48" />
                            </td>
                            <td className="py-3 px-4">
                              <Skeleton className="h-4 w-32" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex justify-center space-x-1">
                                {[...Array(5)].map((_, j) => (
                                  <Skeleton key={j} className="h-5 w-8" />
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex justify-center space-x-2">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-24" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-12 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
