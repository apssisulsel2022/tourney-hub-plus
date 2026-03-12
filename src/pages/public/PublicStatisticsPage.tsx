import React from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import StatisticsPage from "@/pages/StatisticsPage";
import { ShareButton } from "@/components/public/ShareButton";

export default function PublicStatisticsPage() {
  return (
    <PublicLayout
      seo={{
        title: "Statistics · Premier Cup 2026",
        description: "Tournament analytics and performance dashboards.",
        imageUrl: `${window.location.origin}/placeholder.svg`,
      }}
      tournamentName="Premier Cup 2026"
    >
      <div className="max-w-[1600px] mx-auto space-y-4">
        <div className="flex justify-end">
          <ShareButton title="Premier Cup 2026 Statistics" text="Tournament analytics dashboard" url={`${window.location.origin}/public/statistics`} />
        </div>
        <StatisticsPage />
      </div>
    </PublicLayout>
  );
}

