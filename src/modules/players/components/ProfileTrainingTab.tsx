import React from "react";
import { Player } from "../types/player";
import { Activity, Calendar, CheckCircle2, XCircle, Clock, AlertTriangle, TrendingUp, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function ProfileTrainingTab({ player }: { player: Player }) {
  const trainingRecords = [
    { id: "t1", date: "2026-03-11", attendance: "present", performance: 8.5, notes: "Excellent ball control and distribution during scrimmage.", tracking: ["Tactical awareness", "First touch"] },
    { id: "t2", date: "2026-03-09", attendance: "present", performance: 7.2, notes: "Good energy, but needs to focus more on defensive positioning.", tracking: ["Defensive transition"] },
    { id: "t3", date: "2026-03-07", attendance: "excused", performance: 0, notes: "Medical appointment, excused by coach.", tracking: [] },
    { id: "t4", date: "2026-03-04", attendance: "present", performance: 9.0, notes: "Standout performance in finishing drills. Top scorer of the session.", tracking: ["Shooting accuracy"] },
  ];

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case "present": return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "absent": return <XCircle className="h-4 w-4 text-destructive" />;
      case "excused": return <Clock className="h-4 w-4 text-warning" />;
      default: return null;
    }
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case "present": return "bg-success/10 text-success border-success/20";
      case "absent": return "bg-destructive/10 text-destructive border-destructive/20";
      case "excused": return "bg-warning/10 text-warning border-warning/20";
      default: return "";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Summary */}
        <div className="bg-card rounded-3xl border p-8 shadow-sm">
          <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
            <Activity className="h-5 w-5 text-secondary" />
            Attendance Summary
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Attendance Rate</span>
              <span className="text-2xl font-black text-secondary">92%</span>
            </div>
            <Progress value={92} className="h-3 rounded-full bg-muted border border-muted-foreground/10" />
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-muted">
              <div className="text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Present</p>
                <p className="text-lg font-black text-success">24</p>
              </div>
              <div className="text-center border-x border-muted">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Excused</p>
                <p className="text-lg font-black text-warning">2</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Absent</p>
                <p className="text-lg font-black text-destructive">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Development Tracking */}
        <div className="lg:col-span-2 bg-card rounded-3xl border p-8 shadow-sm">
          <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-secondary" />
            Development Focus Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Technical Proficiency", value: 85, trend: "+5%" },
              { label: "Tactical Awareness", value: 72, trend: "+12%" },
              { label: "Physical Conditioning", value: 90, trend: "+2%" },
              { label: "Mental Fortitude", value: 78, trend: "Stable" },
            ].map((skill, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{skill.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black">{skill.value}%</span>
                    <Badge variant="secondary" className="text-[9px] font-black bg-secondary/10 text-secondary border-none">
                      {skill.trend}
                    </Badge>
                  </div>
                </div>
                <Progress value={skill.value} className="h-2 rounded-full bg-muted border border-muted-foreground/10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training Logs */}
      <div className="space-y-6">
        <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
          <Calendar className="h-5 w-5 text-secondary" />
          Recent Training Logs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainingRecords.map((log) => (
            <div key={log.id} className="bg-card rounded-3xl border p-6 shadow-sm hover:shadow-md transition-all border-muted group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center border group-hover:bg-background transition-colors">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-black text-sm">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <Badge variant="secondary" className={cn("text-[9px] font-black uppercase tracking-widest rounded-full px-2 py-0.5 mt-1 border", getAttendanceColor(log.attendance))}>
                      {getAttendanceIcon(log.attendance)}
                      {log.attendance}
                    </Badge>
                  </div>
                </div>
                {log.performance > 0 && (
                  <div className="text-right">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Score</p>
                    <div className="flex items-center gap-1.5 text-secondary">
                      <Star className="h-4 w-4 fill-secondary" />
                      <span className="text-lg font-black leading-none">{log.performance.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-muted-foreground line-clamp-2 mb-4 group-hover:text-foreground transition-colors">
                {log.notes}
              </p>
              {log.tracking.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-muted">
                  {log.tracking.map((item, i) => (
                    <Badge key={i} variant="outline" className="text-[9px] font-black uppercase tracking-widest border-muted-foreground/20 px-2.5 py-1 rounded-lg">
                      {item}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
