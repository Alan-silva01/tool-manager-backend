import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    {[...Array(4)].map((_, i) => (
      <Card key={i}>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const EmprestimosSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <Skeleton className="h-6 w-48 mb-4" />
      <Skeleton className="h-10 w-full mb-4" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-l-4">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-64 mb-2" />
              <Skeleton className="h-4 w-48 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);
