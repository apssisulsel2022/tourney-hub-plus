import React, { useState } from "react";
import { Settings, Shield, Globe, Bell, Mail, Download, Printer, Save, Trash2, AlertCircle, Lock, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SECTIONS = [
  { id: "general", title: "General Configuration", icon: Settings, description: "Basic tournament rules and global settings" },
  { id: "privacy", title: "Access & Privacy", icon: Lock, description: "Manage visibility and participation controls" },
  { id: "notifications", title: "Communications", icon: Bell, description: "Configure automated alerts and messaging" },
  { id: "data", title: "Data & Export", icon: Download, description: "Backup your data and export reports" },
  { id: "danger", title: "Danger Zone", icon: Trash2, description: "Critical operations and deletion" },
];

export function SettingsTab() {
  const [activeSection, setActiveSection] = useState("general");

  const handleSave = () => {
    toast.success("Settings updated successfully", {
      description: "Tournament configuration has been synchronized.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1">
        <div className="space-y-1">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                  isActive ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20" : "hover:bg-muted text-muted-foreground"
                )}
              >
                <section.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "group-hover:text-secondary")} />
                <span className="text-sm font-bold">{section.title}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto text-white/60" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-muted bg-muted/20">
            <h3 className="text-xl font-black">
              {SECTIONS.find(s => s.id === activeSection)?.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {SECTIONS.find(s => s.id === activeSection)?.description}
            </p>
          </div>

          <div className="p-8">
            {activeSection === "general" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Match Duration (Mins)</label>
                    <Input defaultValue="90" type="number" className="font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Points for Win</label>
                    <Input defaultValue="3" type="number" className="font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Max Substitutes</label>
                    <Input defaultValue="5" type="number" className="font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tie-breaker Method</label>
                    <select className="h-10 w-full rounded-lg border bg-background px-3 text-sm font-bold outline-none focus:border-secondary">
                      <option>Goal Difference</option>
                      <option>Head-to-Head</option>
                      <option>Goals Scored</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-muted">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold">Auto-generate Matches</p>
                      <p className="text-xs text-muted-foreground">Automatically create schedule based on team availability</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold">Live Scoring Mode</p>
                      <p className="text-xs text-muted-foreground">Allow referees to update scores in real-time</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-secondary">Public Visibility Active</p>
                    <p className="text-xs text-muted-foreground mt-0.5">This tournament is currently discoverable on the platform's public home page.</p>
                  </div>
                </div>
                
                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold">Public Tournament</p>
                      <p className="text-xs text-muted-foreground">Anyone can view results and standings</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold">Open Registration</p>
                      <p className="text-xs text-muted-foreground">Allow teams to apply directly from public page</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold">Password Protection</p>
                      <p className="text-xs text-muted-foreground">Require a code for team registration</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "data" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center gap-4 p-4 rounded-2xl border bg-background hover:border-secondary hover:shadow-md transition-all text-left group">
                    <div className="h-10 w-10 rounded-xl bg-muted group-hover:bg-secondary/10 flex items-center justify-center transition-colors">
                      <FileText className="h-5 w-5 text-muted-foreground group-hover:text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Match Reports (PDF)</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">Bulk Export</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-4 p-4 rounded-2xl border bg-background hover:border-secondary hover:shadow-md transition-all text-left group">
                    <div className="h-10 w-10 rounded-xl bg-muted group-hover:bg-secondary/10 flex items-center justify-center transition-colors">
                      <Download className="h-5 w-5 text-muted-foreground group-hover:text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Statistics (CSV)</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">Player & Team Data</p>
                    </div>
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-muted/30 border border-muted border-dashed space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Backup & Sync</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">External API Sync</p>
                        <p className="text-xs text-muted-foreground">Sync results to your club website</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure API</Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "danger" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10 space-y-4">
                  <div className="flex items-center gap-3 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <h4 className="font-black text-sm uppercase tracking-widest">Warning Zone</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Actions in this section are permanent and cannot be undone. Please be certain before proceeding with tournament termination or deletion.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-muted hover:border-destructive/30 transition-colors">
                    <div>
                      <p className="text-sm font-bold">Cancel Tournament</p>
                      <p className="text-xs text-muted-foreground">Stops all scheduled matches and notifies participants</p>
                    </div>
                    <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-white font-bold border-destructive/50">CANCEL</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/[0.02]">
                    <div>
                      <p className="text-sm font-bold text-destructive">Delete Permanently</p>
                      <p className="text-xs text-muted-foreground">Remove all records, statistics, and media from the platform</p>
                    </div>
                    <Button variant="destructive" className="font-black">DELETE ALL DATA</Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection !== "danger" && (
              <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-muted">
                <Button variant="ghost" className="font-bold">Reset Changes</Button>
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black gap-2" onClick={handleSave}>
                  <Save className="h-4 w-4" /> SAVE CHANGES
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Support Section */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-dashed border-muted">
          <p className="text-xs text-muted-foreground">Need help with advanced rules? <span className="text-secondary font-bold cursor-pointer hover:underline">Contact Support</span></p>
          <Badge variant="outline" className="text-[10px] font-black uppercase">v1.4.0-stable</Badge>
        </div>
      </div>
    </div>
  );
}
