import { Loader2 } from "lucide-react";
import React from "react";

export function Spinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <span className={"inline-flex items-center justify-center " + className}>
      <Loader2 className="animate-spin" />
    </span>
  );
}
