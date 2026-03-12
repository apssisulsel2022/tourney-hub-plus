import React, { useState, useEffect, useCallback } from "react";
import { Plus, Download, LayoutGrid, List, RefreshCw, FileText, ChevronRight, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { playerService } from "@/modules/players/services/playerService";
import { Player, AgeCategory, Position } from "@/modules/players/types/player";
import { PlayerFilters } from "@/modules/players/components/PlayerFilters";
import { PlayerTable } from "@/modules/players/components/PlayerTable";
import { DigitalPlayerCard } from "@/modules/players/components/DigitalPlayerCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlayersPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<AgeCategory[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  
  // Sorting State
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await playerService.getPlayers(page, limit, {
        search,
        clubId: selectedClubs,
        ageCategory: selectedAges,
        position: selectedPositions,
        sortBy,
        sortOrder,
      });
      setPlayers(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      toast.error("Failed to fetch players");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedClubs, selectedAges, selectedPositions, sortBy, sortOrder]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handleClearAll = () => {
    setSearch("");
    setSelectedClubs([]);
    setSelectedAges([]);
    setSelectedPositions([]);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        await playerService.deletePlayer(id);
        toast.success("Player deleted successfully");
        fetchPlayers();
      } catch (error) {
        toast.error("Failed to delete player");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedPlayers.length} players?`)) {
      try {
        await playerService.bulkDelete(selectedPlayers);
        toast.success(`${selectedPlayers.length} players deleted`);
        setSelectedPlayers([]);
        fetchPlayers();
      } catch (error) {
        toast.error("Failed to perform bulk delete");
      }
    }
  };

  const handleExport = (type: 'csv' | 'pdf') => {
    if (type === 'csv') {
      const headers = ["ID", "Name", "Club", "Age Category", "Position", "Nationality", "Status", "Matches", "Goals", "Assists", "Rating"];
      const csvContent = [
        headers.join(","),
        ...players.map(p => [
          p.id,
          p.name,
          p.clubName,
          p.ageCategory,
          p.primaryPosition,
          p.nationality,
          p.status,
          p.stats.matchesPlayed,
          p.stats.goals,
          p.stats.assists,
          p.stats.averageRating.toFixed(2)
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `players_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV export successful");
    } else {
      toast.info("PDF Exporting...", {
        description: "PDF report generation is being prepared with high-fidelity formatting."
      });
      // In a real app, use jspdf or a server-side generator
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest">
            <Link to="/" className="hover:text-secondary transition-colors">Dashboard</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Player Database</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Athletes & Rosters</h1>
          <p className="text-muted-foreground font-medium">Manage your league's talent, track performance, and verify eligibility.</p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 px-5 rounded-2xl font-bold gap-2 hover:bg-muted/50 transition-all">
                <Download className="h-4 w-4 text-secondary" /> EXPORT
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] rounded-2xl p-2">
              <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2 rounded-xl font-bold text-sm px-3 py-2.5">
                <FileText className="h-4 w-4" /> Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2 rounded-xl font-bold text-sm px-3 py-2.5">
                <FileText className="h-4 w-4" /> Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to="/players/register">
            <Button className="h-11 px-6 bg-secondary hover:bg-secondary/90 text-white font-black rounded-2xl gap-2 shadow-lg shadow-secondary/20 transition-all hover:scale-105 active:scale-95">
              <Plus className="h-5 w-5" /> REGISTER PLAYER
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Quick Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Registered", value: total, color: "text-foreground" },
          { label: "Active Now", value: Math.floor(total * 0.9), color: "text-success" },
          { label: "Pending Verification", value: 12, color: "text-warning" },
          { label: "Season Newcomers", value: 45, color: "text-secondary" },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-2xl border p-5 shadow-sm">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
            <p className={cn("text-2xl font-black leading-none", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-card rounded-3xl border p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4 border-muted">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <RefreshCw className={cn("h-5 w-5 text-secondary transition-all", loading && "animate-spin")} />
            </div>
            <h2 className="text-xl font-black tracking-tight">Database Filters</h2>
          </div>
          
          <div className="flex items-center bg-muted/50 p-1 rounded-xl border">
            <Button 
              variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('table')}
              className={cn("h-8 px-3 rounded-lg gap-2 font-bold text-xs", viewMode === 'table' && "shadow-sm")}
            >
              <List className="h-3.5 w-3.5" /> TABLE
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('grid')}
              className={cn("h-8 px-3 rounded-lg gap-2 font-bold text-xs", viewMode === 'grid' && "shadow-sm")}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> CARDS
            </Button>
          </div>
        </div>

        <PlayerFilters 
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          selectedClubs={selectedClubs}
          onClubsChange={(v) => { setSelectedClubs(v); setPage(1); }}
          selectedAges={selectedAges}
          onAgesChange={(v) => { setSelectedAges(v); setPage(1); }}
          selectedPositions={selectedPositions}
          onPositionsChange={(v) => { setSelectedPositions(v); setPage(1); }}
          onClearAll={handleClearAll}
        />
      </div>

      {/* Main Content: Table or Grid */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[60px] w-full rounded-2xl" />
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
        ) : players.length > 0 ? (
          viewMode === 'table' ? (
            <PlayerTable 
              players={players}
              total={total}
              page={page}
              totalPages={totalPages}
              limit={limit}
              onPageChange={setPage}
              selectedPlayers={selectedPlayers}
              onSelectionChange={setSelectedPlayers}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
              onViewProfile={(id) => navigate(`/players/${id}`)}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {players.map((player) => (
                  <div key={player.id} className="flex justify-center">
                    <DigitalPlayerCard player={player} />
                  </div>
                ))}
              </div>
              
              {/* Grid Pagination */}
              <div className="flex items-center justify-center pt-8 border-t border-muted">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="h-10 rounded-xl font-bold gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="text-sm font-black mx-4">PAGE {page} OF {totalPages}</span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="h-10 rounded-xl font-bold gap-1"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-dashed border-muted-foreground/30 text-center animate-in zoom-in-95 duration-500">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <RefreshCw className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">No players found</h3>
            <p className="text-muted-foreground max-w-sm mt-2 font-medium">We couldn't find any players matching your current filters. Try adjusting your search or resetting filters.</p>
            <Button 
              variant="outline" 
              onClick={handleClearAll}
              className="mt-8 h-11 px-8 rounded-2xl font-black text-xs uppercase tracking-widest"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
