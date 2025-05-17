import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from 'lucide-react';

export function EventCardSkeleton() {
  return (
    <Card className="mb-2 py-2 relative flex-row items-center animate-pulse">
      <div className="flex-col flex-1">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">
            <Skeleton className="h-6 w-2/3 mb-2" />
          </CardTitle>
          <CardDescription className="flex items-center text-xs">
            <Skeleton className="h-4 w-1/4" />
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </div>
      <ChevronRight size={16} className="text-muted-foreground m-3 opacity-40" />
    </Card>
  )
}