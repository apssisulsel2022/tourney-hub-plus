import React from "react";

interface BracketConnectorProps {
  count: number;
  height: string;
  spacing: string;
  className?: string;
}

export function BracketConnector({ count, height, spacing, className }: BracketConnectorProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className={spacing}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`w-8 ${height} border-r-2 border-t-2 border-b-2 border-border rounded-r-lg`} />
        ))}
      </div>
    </div>
  );
}
