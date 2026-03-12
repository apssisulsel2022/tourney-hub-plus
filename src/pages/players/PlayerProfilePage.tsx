import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit2, 
  Share2, 
  MoreVertical, 
  Shield, 
  User, 
  BarChart3, 
  FileText, 
  Swords, 
  Activity,
  ChevronRight,
  Download,
  Trash2,
  Mail,
  Phone
} from "lucide-react";
import { playerService } from "@/modules/players/services/playerService";
import { Player } from "@/modules/players/types/player";
import { ProfileInfoTab } from "@/modules/players/components/ProfileInfoTab";
import { ProfileStatsTab } from "@/modules/players/components/ProfileStatsTab";
import { ProfileDocsTab } from "@/modules/players/components/ProfileDocsTab";
import { ProfileMatchesTab } from "@/modules/players/components/ProfileMatchesTab";
import { ProfileTrainingTab } from "@/modules/players/components/ProfileTrainingTab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const tabs = [
  { id: "info", label: "Player Info", icon: User },
  { id: "stats", label: "Statistics", icon: BarChart3 },
  { id: "docs", label: "Documents", icon: FileText },
  { id: "matches", label: "Match History", icon: Swords },
  { id: "training", label: "Training Records", icon: Activity },
];

export default function PlayerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await playerService.getPlayerById(id);
        if (data) {
          setPlayer(data);
        } else {
          toast.error("Player not found");
          navigate("/players");
        }
      } catch (error) {
        toast.error("Failed to load player profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-40 rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-3xl" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[600px] w-full rounded-3xl" />
      </div>
    );
  }

  if (!player) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "info": return <ProfileInfoTab player={player} />;
      case "stats": return <ProfileStatsTab player={player} />;
      case "docs": return <ProfileDocsTab player={player} />;
      case "matches": return <ProfileMatchesTab player={player} />;
      case "training": return <ProfileTrainingTab player={player} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/players">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-3xl font-black tracking-tight">Player Profile</h1>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <Link to="/players" className="hover:text-secondary transition-colors">Players</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{player.name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-5 rounded-2xl font-bold gap-2 hover:bg-muted/50 transition-all">
            <Share2 className="h-4 w-4 text-secondary" /> SHARE
          </Button>
          <Button className="h-11 px-6 bg-secondary hover:bg-secondary/90 text-white font-black rounded-2xl gap-2 shadow-lg shadow-secondary/20 transition-all hover:scale-105 active:scale-95">
            <Edit2 className="h-4 w-4" /> EDIT PROFILE
          </Button>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/60 rounded-[2.5rem] blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative bg-card rounded-[2.5rem] border p-8 shadow-sm overflow-hidden border-muted">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Shield className="h-64 w-64 -rotate-12" />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center relative z-10">
            {/* Avatar Section */}
            <div className="relative group/avatar">
              <div className="absolute inset-0 bg-secondary blur-2xl opacity-20 animate-pulse" />
              <Avatar className="h-40 w-40 rounded-[2.5rem] border-4 border-muted group-hover/avatar:border-secondary/30 transition-all duration-500 relative z-10">
                <AvatarImage src={player.photoUrl} alt={player.name} className="object-cover" />
                <AvatarFallback className="bg-secondary/10 text-secondary font-black text-4xl">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-3 -right-3 bg-secondary text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-xl border-4 border-background relative z-20">
                #{player.id.split('-').pop()}
              </div>
            </div>
            
            {/* Name and Quick Details */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-5xl font-black tracking-tighter">{player.name}</h2>
                  <Badge variant={player.status === 'active' ? 'success' : 'secondary'} className="h-7 px-4 font-black uppercase tracking-widest rounded-full">
                    {player.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-bold">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-secondary" /> {player.clubName}
                  </div>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-secondary" /> {player.primaryPosition}
                  </div>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-secondary" /> {player.ageCategory}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="outline" className="h-10 px-5 rounded-xl font-bold gap-2 bg-muted/30 border-muted hover:bg-muted/50 transition-all">
                  <Mail className="h-4 w-4 text-muted-foreground" /> {player.email}
                </Button>
                <Button variant="outline" className="h-10 px-5 rounded-xl font-bold gap-2 bg-muted/30 border-muted hover:bg-muted/50 transition-all">
                  <Phone className="h-4 w-4 text-muted-foreground" /> {player.phone}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-muted/30 border-muted hover:bg-muted/50">
                      <MoreVertical className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[220px] rounded-2xl p-2 shadow-xl border-muted">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">Quick Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 rounded-xl font-bold text-sm px-3 py-2.5">
                      <Download className="h-4 w-4 text-secondary" /> Download Player Card
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 rounded-xl font-bold text-sm px-3 py-2.5">
                      <Share2 className="h-4 w-4 text-secondary" /> Share Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 rounded-xl font-bold text-sm px-3 py-2.5 text-destructive focus:text-destructive focus:bg-destructive/5">
                      <Trash2 className="h-4 w-4" /> Deactivate Player
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-2 gap-4 w-full lg:w-[320px]">
              <div className="p-5 rounded-[2rem] bg-muted/30 border border-muted/50 text-center flex flex-col items-center justify-center transition-all hover:bg-muted/50 group/stat">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 group-hover/stat:text-secondary transition-colors">Avg. Rating</p>
                <p className="text-3xl font-black">{player.stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="p-5 rounded-[2rem] bg-secondary/10 border border-secondary/20 text-center flex flex-col items-center justify-center transition-all hover:bg-secondary/20 group/stat">
                <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1 group-hover/stat:text-secondary/80 transition-colors">Matches</p>
                <p className="text-3xl font-black text-secondary">{player.stats.matchesPlayed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-muted/50 rounded-2xl border w-fit shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all",
              activeTab === tab.id 
                ? "bg-background text-secondary shadow-md ring-1 ring-black/5" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-secondary" : "text-muted-foreground")} />
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering */}
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>
    </div>
  );
}
