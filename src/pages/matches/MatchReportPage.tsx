import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, MessageSquareText, NotebookPen, ShieldAlert, Shuffle, Timer, Trophy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TeamSide = "home" | "away";
type GoalType = "regular" | "penalty" | "own_goal";
type CardType = "yellow" | "yellow_red" | "red";

type GoalEntry = {
  id: string;
  createdAt: string;
  time: string;
  team: TeamSide;
  scorer: string;
  assist: string;
  goalType: GoalType;
};

type CardEntry = {
  id: string;
  createdAt: string;
  time: string;
  team: TeamSide;
  player: string;
  cardType: CardType;
  offense: string;
};

type SubEntry = {
  id: string;
  createdAt: string;
  time: string;
  team: TeamSide;
  playerOut: string;
  playerIn: string;
};

type Notes = {
  notes: string;
  weather: string;
  pitch: string;
  attendance: string;
};

type Draft = {
  goals: GoalEntry[];
  cards: CardEntry[];
  substitutions: SubEntry[];
  notes: Notes;
  updatedAt: string;
};

const STORAGE_KEY = "match-report:draft:v1";

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const parseMinuteKey = (t: string) => {
  const trimmed = t.trim();
  const m = trimmed.match(/^(\d+)\+(\d+)$/);
  if (m) return Number(m[1]) * 1000 + Number(m[2]);
  const n = Number(trimmed.replace(/[^0-9]/g, ""));
  return Number.isFinite(n) ? n * 1000 : 0;
};

const validateTime = (t: string) => {
  if (!t.trim()) return "Time is required";
  const key = parseMinuteKey(t);
  if (key <= 0) return "Time must be a valid minute";
  if (key > 130000) return "Time must be within match duration";
  return null;
};

const sortByTimeAsc = <T extends { time: string; createdAt: string }>(items: T[]) => {
  return [...items].sort((a, b) => {
    const ka = parseMinuteKey(a.time);
    const kb = parseMinuteKey(b.time);
    if (ka === kb) return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return ka - kb;
  });
};

const defaultDraft: Draft = {
  goals: [],
  cards: [],
  substitutions: [],
  notes: { notes: "", weather: "", pitch: "", attendance: "" },
  updatedAt: new Date().toISOString(),
};

export default function MatchReportPage() {
  const [draft, setDraft] = useState<Draft>(defaultDraft);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const goalsRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const subsRef = useRef<HTMLDivElement | null>(null);
  const notesRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Draft;
      if (!parsed || typeof parsed !== "object") return;
      setDraft(parsed);
      setLastSavedAt(parsed.updatedAt);
      setSaveState("saved");
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    setSaveState("saving");
    const id = window.setTimeout(() => {
      const savedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...draft, updatedAt: savedAt }));
      setLastSavedAt(savedAt);
      setSaveState("saved");
    }, 700);
    return () => window.clearTimeout(id);
  }, [draft]);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addGoal = useCallback(() => {
    const entry: GoalEntry = {
      id: uid(),
      createdAt: new Date().toISOString(),
      time: "",
      team: "home",
      scorer: "",
      assist: "",
      goalType: "regular",
    };
    setDraft((p) => ({ ...p, goals: [...p.goals, entry] }));
    scrollTo(goalsRef);
    toast.success("Goal entry added");
  }, []);

  const addCard = useCallback(() => {
    const entry: CardEntry = {
      id: uid(),
      createdAt: new Date().toISOString(),
      time: "",
      team: "home",
      player: "",
      cardType: "yellow",
      offense: "",
    };
    setDraft((p) => ({ ...p, cards: [...p.cards, entry] }));
    scrollTo(cardsRef);
    toast.success("Card entry added");
  }, []);

  const addSub = useCallback(() => {
    const entry: SubEntry = {
      id: uid(),
      createdAt: new Date().toISOString(),
      time: "",
      team: "home",
      playerOut: "",
      playerIn: "",
    };
    setDraft((p) => ({ ...p, substitutions: [...p.substitutions, entry] }));
    scrollTo(subsRef);
    toast.success("Substitution entry added");
  }, []);

  const addNote = useCallback(() => {
    scrollTo(notesRef);
    toast.success("Ready for notes");
  }, []);

  const saveDraft = useCallback(() => {
    const next = { ...draft, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setLastSavedAt(next.updatedAt);
    setSaveState("saved");
    setDraft(next);
    toast.success("Draft saved");
  }, [draft]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveDraft();
        return;
      }
      if (isTyping) return;
      const k = e.key.toLowerCase();
      if (k === "g") addGoal();
      if (k === "c") addCard();
      if (k === "s") addSub();
      if (k === "n") addNote();
      if (k === "t") scrollTo(topRef);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [addCard, addGoal, addNote, addSub, saveDraft]);

  const errors = useMemo(() => {
    const goalErrors: Record<string, Partial<Record<keyof GoalEntry, string>>> = {};
    for (const g of draft.goals) {
      const e: Partial<Record<keyof GoalEntry, string>> = {};
      const timeErr = validateTime(g.time);
      if (timeErr) e.time = timeErr;
      if (!g.scorer.trim()) e.scorer = "Scoring player is required";
      if (!g.goalType) e.goalType = "Goal type is required";
      goalErrors[g.id] = e;
    }

    const cardErrors: Record<string, Partial<Record<keyof CardEntry, string>>> = {};
    for (const c of draft.cards) {
      const e: Partial<Record<keyof CardEntry, string>> = {};
      const timeErr = validateTime(c.time);
      if (timeErr) e.time = timeErr;
      if (!c.player.trim()) e.player = "Player is required";
      if (!c.offense.trim()) e.offense = "Offense is required";
      cardErrors[c.id] = e;
    }

    const subErrors: Record<string, Partial<Record<keyof SubEntry, string>>> = {};
    for (const s of draft.substitutions) {
      const e: Partial<Record<keyof SubEntry, string>> = {};
      const timeErr = validateTime(s.time);
      if (timeErr) e.time = timeErr;
      if (!s.playerOut.trim()) e.playerOut = "Outgoing player is required";
      if (!s.playerIn.trim()) e.playerIn = "Incoming player is required";
      if (s.playerOut.trim() && s.playerIn.trim() && s.playerOut.trim() === s.playerIn.trim()) e.playerIn = "Incoming must be different";
      subErrors[s.id] = e;
    }

    const noteErrors: Partial<Record<keyof Notes, string>> = {};
    if (draft.notes.attendance && (!Number.isFinite(Number(draft.notes.attendance)) || Number(draft.notes.attendance) < 0)) {
      noteErrors.attendance = "Attendance must be a valid number";
    }

    const has = <T extends Record<string, Partial<Record<string, string>>>>(obj: T) =>
      Object.values(obj).some((m) => Object.values(m).some((v) => Boolean(v)));

    const hasErrors = has(goalErrors) || has(cardErrors) || has(subErrors) || Object.values(noteErrors).some(Boolean);
    return { goalErrors, cardErrors, subErrors, noteErrors, hasErrors };
  }, [draft]);

  const submit = () => {
    if (errors.hasErrors) {
      toast.error("Fix validation errors before submitting");
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    setSaveState("idle");
    setLastSavedAt(null);
    toast.success("Referee report submitted successfully");
  };

  const sortedGoals = useMemo(() => sortByTimeAsc(draft.goals), [draft.goals]);
  const sortedCards = useMemo(() => sortByTimeAsc(draft.cards), [draft.cards]);
  const sortedSubs = useMemo(() => sortByTimeAsc(draft.substitutions), [draft.substitutions]);

  const saveBadge = saveState === "saving" ? (
    <Badge variant="secondary" className="font-black text-[10px] uppercase tracking-widest">Saving…</Badge>
  ) : saveState === "saved" ? (
    <Badge variant="success" className="font-black text-[10px] uppercase tracking-widest">Saved</Badge>
  ) : (
    <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest">Draft</Badge>
  );

  return (
    <div className="space-y-8 max-w-5xl pb-20" ref={topRef}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/matches" className="text-muted-foreground hover:text-foreground" aria-label="Back to matches">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Referee Report</h1>
            <p className="text-muted-foreground font-medium">Capture goals, cards, substitutions, and match notes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveBadge}
          {lastSavedAt && (
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {new Date(lastSavedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="bg-card rounded-3xl border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <NotebookPen className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Quick Actions</h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Shortcuts: G Goal, C Card, S Sub, N Notes, Ctrl+S Save</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="h-10 rounded-2xl font-black gap-2 bg-secondary hover:bg-secondary/90 text-white" onClick={addGoal}>
              <Trophy className="h-4 w-4" /> Add Goal
            </Button>
            <Button variant="outline" className="h-10 rounded-2xl font-black gap-2" onClick={addCard}>
              <ShieldAlert className="h-4 w-4 text-warning" /> Show Card
            </Button>
            <Button variant="outline" className="h-10 rounded-2xl font-black gap-2" onClick={addSub}>
              <Shuffle className="h-4 w-4 text-info" /> Make Substitution
            </Button>
            <Button variant="outline" className="h-10 rounded-2xl font-black gap-2" onClick={addNote}>
              <MessageSquareText className="h-4 w-4 text-secondary" /> Add Note
            </Button>
          </div>
        </div>
      </div>

      <div ref={goalsRef} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-success" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Goals</h2>
          </div>
          <Button variant="outline" className="h-10 rounded-2xl font-bold gap-2" onClick={addGoal}>
            Add Goal
          </Button>
        </div>

        <div className="space-y-4">
          {sortedGoals.length === 0 ? (
            <div className="bg-muted/20 rounded-3xl border border-dashed p-10 text-center text-sm text-muted-foreground font-medium">
              No goals logged yet.
            </div>
          ) : (
            sortedGoals.map((g) => {
              const e = errors.goalErrors[g.id] ?? {};
              return (
                <div key={g.id} className={cn("bg-card rounded-3xl border p-6 shadow-sm", Object.values(e).some(Boolean) && "border-destructive/30")}>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-1">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Time</label>
                      <div className="mt-2 relative">
                        <Timer className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          value={g.time}
                          onChange={(ev) => setDraft((p) => ({ ...p, goals: p.goals.map((x) => (x.id === g.id ? { ...x, time: ev.target.value } : x)) }))}
                          className={cn("h-11 rounded-2xl pl-10", e.time && "border-destructive")}
                          placeholder="e.g. 45+2"
                          aria-label="Goal time"
                        />
                      </div>
                      {e.time && <div className="text-xs font-bold text-destructive mt-2">{e.time}</div>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Scoring Player</label>
                      <Input
                        value={g.scorer}
                        onChange={(ev) => setDraft((p) => ({ ...p, goals: p.goals.map((x) => (x.id === g.id ? { ...x, scorer: ev.target.value } : x)) }))}
                        className={cn("h-11 rounded-2xl mt-2", e.scorer && "border-destructive")}
                        placeholder="Player name"
                        aria-label="Scoring player"
                      />
                      {e.scorer && <div className="text-xs font-bold text-destructive mt-2">{e.scorer}</div>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Assist Provider</label>
                      <Input
                        value={g.assist}
                        onChange={(ev) => setDraft((p) => ({ ...p, goals: p.goals.map((x) => (x.id === g.id ? { ...x, assist: ev.target.value } : x)) }))}
                        className="h-11 rounded-2xl mt-2"
                        placeholder="Optional"
                        aria-label="Assist provider"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Goal Type</label>
                      <Select value={g.goalType} onValueChange={(v) => setDraft((p) => ({ ...p, goals: p.goals.map((x) => (x.id === g.id ? { ...x, goalType: v as GoalType } : x)) }))}>
                        <SelectTrigger className={cn("h-11 rounded-2xl mt-2 font-bold", e.goalType && "border-destructive")}>
                          <SelectValue placeholder="Select goal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="penalty">Penalty</SelectItem>
                          <SelectItem value="own_goal">Own Goal</SelectItem>
                        </SelectContent>
                      </Select>
                      {e.goalType && <div className="text-xs font-bold text-destructive mt-2">{e.goalType}</div>}
                    </div>

                    <div className="md:col-span-1">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Team</label>
                      <Select value={g.team} onValueChange={(v) => setDraft((p) => ({ ...p, goals: p.goals.map((x) => (x.id === g.id ? { ...x, team: v as TeamSide } : x)) }))}>
                        <SelectTrigger className="h-11 rounded-2xl mt-2 font-bold">
                          <SelectValue placeholder="Team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="away">Away</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Created {new Date(g.createdAt).toLocaleString()}
                    </span>
                    <Button
                      variant="destructive"
                      className="h-9 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      onClick={() => setDraft((p) => ({ ...p, goals: p.goals.filter((x) => x.id !== g.id) }))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div ref={cardsRef} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-warning" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Cards</h2>
          </div>
          <Button variant="outline" className="h-10 rounded-2xl font-bold gap-2" onClick={addCard}>
            Show Card
          </Button>
        </div>

        <div className="space-y-4">
          {sortedCards.length === 0 ? (
            <div className="bg-muted/20 rounded-3xl border border-dashed p-10 text-center text-sm text-muted-foreground font-medium">
              No cards logged yet.
            </div>
          ) : (
            sortedCards.map((c) => {
              const e = errors.cardErrors[c.id] ?? {};
              return (
                <div key={c.id} className={cn("bg-card rounded-3xl border p-6 shadow-sm", Object.values(e).some(Boolean) && "border-destructive/30")}>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-1">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Time</label>
                      <Input
                        value={c.time}
                        onChange={(ev) => setDraft((p) => ({ ...p, cards: p.cards.map((x) => (x.id === c.id ? { ...x, time: ev.target.value } : x)) }))}
                        className={cn("h-11 rounded-2xl mt-2", e.time && "border-destructive")}
                        placeholder="e.g. 23"
                        aria-label="Card time"
                      />
                      {e.time && <div className="text-xs font-bold text-destructive mt-2">{e.time}</div>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Player</label>
                      <Input
                        value={c.player}
                        onChange={(ev) => setDraft((p) => ({ ...p, cards: p.cards.map((x) => (x.id === c.id ? { ...x, player: ev.target.value } : x)) }))}
                        className={cn("h-11 rounded-2xl mt-2", e.player && "border-destructive")}
                        placeholder="Player name"
                        aria-label="Card player"
                      />
                      {e.player && <div className="text-xs font-bold text-destructive mt-2">{e.player}</div>}
                    </div>

                    <div className="md:col-span-1">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Card</label>
                      <Select value={c.cardType} onValueChange={(v) => setDraft((p) => ({ ...p, cards: p.cards.map((x) => (x.id === c.id ? { ...x, cardType: v as CardType } : x)) }))}>
                        <SelectTrigger className="h-11 rounded-2xl mt-2 font-bold">
                          <SelectValue placeholder="Card type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yellow">Yellow</SelectItem>
                          <SelectItem value="yellow_red">Yellow-Red</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-1">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Team</label>
                      <Select value={c.team} onValueChange={(v) => setDraft((p) => ({ ...p, cards: p.cards.map((x) => (x.id === c.id ? { ...x, team: v as TeamSide } : x)) }))}>
                        <SelectTrigger className="h-11 rounded-2xl mt-2 font-bold">
                          <SelectValue placeholder="Team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="away">Away</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-6">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Offense Description</label>
                      <Input
                        value={c.offense}
                        onChange={(ev) => setDraft((p) => ({ ...p, cards: p.cards.map((x) => (x.id === c.id ? { ...x, offense: ev.target.value } : x)) }))}
                        className={cn("h-11 rounded-2xl mt-2", e.offense && "border-destructive")}
                        placeholder="e.g. Dissent, violent conduct, foul"
                        aria-label="Offense description"
                      />
                      {e.offense && <div className="text-xs font-bold text-destructive mt-2">{e.offense}</div>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Created {new Date(c.createdAt).toLocaleString()}
                    </span>
                    <Button
                      variant="destructive"
                      className="h-9 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      onClick={() => setDraft((p) => ({ ...p, cards: p.cards.filter((x) => x.id !== c.id) }))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div ref={subsRef} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-info/10 flex items-center justify-center">
              <Shuffle className="h-5 w-5 text-info" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Substitutions</h2>
          </div>
          <Button variant="outline" className="h-10 rounded-2xl font-bold gap-2" onClick={addSub}>
            Make Substitution
          </Button>
        </div>

        <div className="space-y-4">
          {sortedSubs.length === 0 ? (
            <div className="bg-muted/20 rounded-3xl border border-dashed p-10 text-center text-sm text-muted-foreground font-medium">
              No substitutions logged yet.
            </div>
          ) : (
            sortedSubs.map((s) => {
              const e = errors.subErrors[s.id] ?? {};
              return (
                <div key={s.id} className={cn("bg-card rounded-3xl border p-6 shadow-sm", Object.values(e).some(Boolean) && "border-destructive/30")}>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-1">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Time</label>
                      <Input
                        value={s.time}
                        onChange={(ev) => setDraft((p) => ({ ...p, substitutions: p.substitutions.map((x) => (x.id === s.id ? { ...x, time: ev.target.value } : x)) }))}
                        className={cn("h-11 rounded-2xl mt-2", e.time && "border-destructive")}
                        placeholder="e.g. 60"
                        aria-label="Substitution time"
                      />
                      {e.time && <div className="text-xs font-bold text-destructive mt-2">{e.time}</div>}
                    </div>

                    <div className="md:col-span-1">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Team</label>
                      <Select value={s.team} onValueChange={(v) => setDraft((p) => ({ ...p, substitutions: p.substitutions.map((x) => (x.id === s.id ? { ...x, team: v as TeamSide } : x)) }))}>
                        <SelectTrigger className="h-11 rounded-2xl mt-2 font-bold">
                          <SelectValue placeholder="Team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="away">Away</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Outgoing Player</label>
                      <Input
                        value={s.playerOut}
                        onChange={(ev) => setDraft((p) => ({ ...p, substitutions: p.substitutions.map((x) => (x.id === s.id ? { ...x, playerOut: ev.target.value } : x)) }))}
                        className={cn("h-11 rounded-2xl mt-2", e.playerOut && "border-destructive")}
                        placeholder="Player out"
                        aria-label="Outgoing player"
                      />
                      {e.playerOut && <div className="text-xs font-bold text-destructive mt-2">{e.playerOut}</div>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Incoming Player</label>
                      <Input
                        value={s.playerIn}
                        onChange={(ev) => setDraft((p) => ({ ...p, substitutions: p.substitutions.map((x) => (x.id === s.id ? { ...x, playerIn: ev.target.value } : x)) }))}
                        className={cn("h-11 rounded-2xl mt-2", e.playerIn && "border-destructive")}
                        placeholder="Player in"
                        aria-label="Incoming player"
                      />
                      {e.playerIn && <div className="text-xs font-bold text-destructive mt-2">{e.playerIn}</div>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Created {new Date(s.createdAt).toLocaleString()}
                    </span>
                    <Button
                      variant="destructive"
                      className="h-9 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      onClick={() => setDraft((p) => ({ ...p, substitutions: p.substitutions.filter((x) => x.id !== s.id) }))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div ref={notesRef} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <ClipboardCheck className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="text-xl font-black tracking-tight">Match Notes</h2>
        </div>

        <div className="bg-card rounded-3xl border p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Weather</label>
              <Input
                value={draft.notes.weather}
                onChange={(e) => setDraft((p) => ({ ...p, notes: { ...p.notes, weather: e.target.value } }))}
                className="h-11 rounded-2xl mt-2"
                placeholder="e.g. Clear, Rain, Windy"
                aria-label="Weather conditions"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pitch</label>
              <Input
                value={draft.notes.pitch}
                onChange={(e) => setDraft((p) => ({ ...p, notes: { ...p.notes, pitch: e.target.value } }))}
                className="h-11 rounded-2xl mt-2"
                placeholder="e.g. Dry, Wet, Damaged"
                aria-label="Pitch conditions"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Attendance</label>
              <Input
                value={draft.notes.attendance}
                onChange={(e) => setDraft((p) => ({ ...p, notes: { ...p.notes, attendance: e.target.value } }))}
                className={cn("h-11 rounded-2xl mt-2", errors.noteErrors.attendance && "border-destructive")}
                placeholder="e.g. 3200"
                aria-label="Attendance"
              />
              {errors.noteErrors.attendance && <div className="text-xs font-bold text-destructive mt-2">{errors.noteErrors.attendance}</div>}
            </div>
            <div className="md:col-span-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Additional Observations</label>
              <Textarea
                value={draft.notes.notes}
                onChange={(e) => setDraft((p) => ({ ...p, notes: { ...p.notes, notes: e.target.value } }))}
                className="min-h-[140px] rounded-2xl mt-2"
                placeholder="Write referee observations, incidents, and notes..."
                aria-label="Match notes"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button variant="outline" className="h-11 rounded-2xl font-black gap-2" onClick={saveDraft}>
          Save Draft
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-11 rounded-2xl font-black" onClick={() => scrollTo(topRef)}>
            Back to Top
          </Button>
          <Button
            className="h-11 rounded-2xl font-black gap-2 bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/20"
            onClick={submit}
            aria-disabled={errors.hasErrors}
          >
            Submit Report
          </Button>
        </div>
      </div>
    </div>
  );
}
