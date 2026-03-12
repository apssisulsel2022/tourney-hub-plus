import React from "react";
import { Player, PlayerDocument } from "../types/player";
import { FileText, Download, Trash2, Plus, Clock, ShieldCheck, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProfileDocsTab({ player }: { player: Player }) {
  const getDocIcon = (type: PlayerDocument["type"]) => {
    switch (type) {
      case "contract": return <ShieldCheck className="h-5 w-5 text-blue-500" />;
      case "medical": return <Clock className="h-5 w-5 text-red-500" />;
      case "certification": return <FileType className="h-5 w-5 text-secondary" />;
      default: return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-card p-6 rounded-3xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Document Management</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{player.documents.length} FILES UPLOADED</p>
          </div>
        </div>
        <Button className="h-11 px-6 bg-secondary hover:bg-secondary/90 text-white font-black rounded-2xl gap-2 shadow-lg shadow-secondary/20 transition-all hover:scale-105 active:scale-95">
          <Plus className="h-5 w-5" /> UPLOAD DOCUMENT
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {player.documents.length > 0 ? (
          player.documents.map((doc) => (
            <div key={doc.id} className="bg-card rounded-3xl border p-6 shadow-sm hover:shadow-md transition-all group border-muted">
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center border group-hover:bg-background transition-colors">
                  {getDocIcon(doc.type)}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary/10 hover:text-secondary">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1 mb-4">
                <h4 className="font-black text-lg tracking-tight truncate">{doc.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-muted-foreground/30">
                    {doc.type}
                  </Badge>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted-foreground/30 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <h4 className="text-xl font-black tracking-tight text-muted-foreground">No documents found</h4>
            <p className="text-sm font-medium text-muted-foreground/60 max-w-xs mx-auto mt-2">
              Start by uploading the player's contract, medical clearance, or ID verification files.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
