
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Users, Shield, Check, Info, Upload, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tournament } from "@/modules/tournaments/types/tournament";

export default function TournamentRegistrationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [myTeams, setMyTeams] = useState<any[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [players, setPlayers] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tData, error: tError } = await supabase
          .from("tournaments")
          .select("*")
          .eq("id", id)
          .single();

        if (tError) throw tError;
        setTournament({
          id: tData.id,
          name: tData.name,
          description: tData.description,
          format: tData.format,
          ageCategory: tData.age_category,
          startDate: tData.start_date,
          endDate: tData.end_date,
          location: tData.location,
          maxTeams: tData.max_teams,
          registrationDeadline: tData.registration_deadline,
          logoUrl: tData.logo_url,
          organizationId: tData.organization_id,
          status: tData.status,
          registrationFee: tData.registration_fee || 0,
          sportType: tData.sport_type,
        });

        // Fetch teams owned/managed by current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: teams, error: teamsError } = await supabase
            .from("teams")
            .select("id, name")
            .eq("organization_id", tData.organization_id); // Simplified for demo
            
          if (teams) setMyTeams(teams);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load tournament details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const addPlayerRow = () => {
    setPlayers([...players, { name: "", number: "", position: "forward", ktp: null }]);
  };

  const removePlayerRow = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const updatePlayer = (index: number, field: string, value: any) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const calculateTotal = () => {
    if (!tournament) return 0;
    // Base fee + some per-player fee if applicable, or just base fee
    return tournament.registrationFee;
  };

  const handleRegister = async () => {
    if (!selectedTeamId) {
      toast.error("Please select a team");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Register team for tournament
      const { error: regError } = await supabase.from("tournament_teams").insert({
        tournament_id: id,
        team_id: selectedTeamId,
        status: 'pending'
      });

      if (regError) throw regError;

      // 2. Create payment record
      const { error: payError } = await supabase.from("payments").insert({
        tournament_id: id,
        team_id: selectedTeamId,
        amount: calculateTotal(),
        status: 'pending',
        payment_method: 'bank_transfer'
      });

      if (payError) throw payError;

      toast.success("Registration submitted!", {
        description: "Please proceed to payment to confirm your registration."
      });
      navigate(`/tournaments/${id}`);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to submit registration");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!tournament) return <div>Tournament not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link to="/tournaments">
          <Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Tournament Registration</h1>
          <p className="text-muted-foreground">{tournament.name} · {tournament.sportType}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-secondary" /> Team Information</CardTitle>
              <CardDescription>Select the team you want to register for this tournament.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Team</Label>
                <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team..." />
                  </SelectTrigger>
                  <SelectContent>
                    {myTeams.map(team => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-secondary" /> Player Roster</CardTitle>
                <CardDescription>Add players to your roster for this tournament.</CardDescription>
              </div>
              <Button onClick={addPlayerRow} variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Add Player
              </Button>
            </CardHeader>
            <CardContent>
              {players.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-xl">
                  <Users className="h-10 w-10 text-muted/20 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No players added yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {players.map((player, index) => (
                    <div key={index} className="flex flex-wrap items-end gap-3 p-4 bg-muted/30 rounded-xl">
                      <div className="flex-1 min-w-[150px] space-y-2">
                        <Label className="text-xs">Name</Label>
                        <Input 
                          placeholder="Full Name" 
                          value={player.name} 
                          onChange={(e) => updatePlayer(index, "name", e.target.value)} 
                        />
                      </div>
                      <div className="w-20 space-y-2">
                        <Label className="text-xs">No.</Label>
                        <Input 
                          type="number" 
                          placeholder="10" 
                          value={player.number} 
                          onChange={(e) => updatePlayer(index, "number", e.target.value)} 
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <Label className="text-xs">Position</Label>
                        <Select value={player.position} onValueChange={(v) => updatePlayer(index, "position", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="goalkeeper">GK</SelectItem>
                            <SelectItem value="defender">DEF</SelectItem>
                            <SelectItem value="midfielder">MID</SelectItem>
                            <SelectItem value="forward">FWD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removePlayerRow(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-secondary/20 shadow-lg shadow-secondary/5">
            <CardHeader>
              <CardTitle>Registration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Registration Fee</span>
                <span className="font-bold">Rp {tournament.registrationFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Players ({players.length})</span>
                <span className="font-bold">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold">Total Amount</span>
                <span className="text-2xl font-black text-secondary">Rp {calculateTotal().toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button 
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black h-12 text-lg"
                onClick={handleRegister}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CreditCard className="h-5 w-5 mr-2" />}
                Confirm & Pay
              </Button>
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                Secure Payment Powered by Midtrans
              </p>
            </CardFooter>
          </Card>

          <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl flex gap-3">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-blue-500">Requirements Check</p>
              <p className="text-blue-500/70 leading-relaxed">
                Make sure all players meet the age category <strong>{tournament.ageCategory}</strong>. Documents verification will be required after registration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
