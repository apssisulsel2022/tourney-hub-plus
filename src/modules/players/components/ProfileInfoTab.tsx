import React from "react";
import { Player } from "../types/player";
import { Mail, Phone, MapPin, Calendar, User, Shield, AlertCircle } from "lucide-react";

export function ProfileInfoTab({ player }: { player: Player }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Personal Details */}
      <div className="bg-card rounded-3xl border p-8 shadow-sm">
        <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
          <User className="h-5 w-5 text-secondary" />
          Personal Details
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Date of Birth</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-bold">{new Date(player.dateOfBirth).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Nationality</p>
              <p className="font-bold">{player.nationality}</p>
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Email Address</p>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold">{player.email}</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Phone Number</p>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold">{player.phone}</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Physical Address</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold">{player.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Club & Emergency Info */}
      <div className="space-y-8">
        <div className="bg-card rounded-3xl border p-8 shadow-sm">
          <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-secondary" />
            Club Assignment
          </h3>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-muted/50">
            <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center border shadow-sm">
              {player.clubLogo ? (
                <img src={player.clubLogo} alt={player.clubName} className="h-8 w-8 object-contain" />
              ) : (
                <Shield className="h-6 w-6 text-secondary" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Club</p>
              <p className="text-lg font-black">{player.clubName}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Age Category</p>
              <p className="font-bold">{player.ageCategory}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Primary Position</p>
              <p className="font-bold">{player.primaryPosition}</p>
            </div>
          </div>
        </div>

        <div className="bg-destructive/5 rounded-3xl border border-destructive/10 p-8 shadow-sm">
          <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Emergency Contact
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-destructive/60 uppercase tracking-widest mb-1">Contact Name</p>
              <p className="font-black">{player.emergencyContact.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-destructive/60 uppercase tracking-widest mb-1">Relationship</p>
                <p className="font-bold">{player.emergencyContact.relationship}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-destructive/60 uppercase tracking-widest mb-1">Phone</p>
                <p className="font-bold">{player.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
