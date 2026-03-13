
-- Function to update standings when a match is completed
CREATE OR REPLACE FUNCTION public.update_standings_on_match_complete()
RETURNS TRIGGER AS $$
DECLARE
    points_home INTEGER := 0;
    points_away INTEGER := 0;
    home_win INTEGER := 0;
    away_win INTEGER := 0;
    home_loss INTEGER := 0;
    away_loss INTEGER := 0;
    home_draw INTEGER := 0;
    away_draw INTEGER := 0;
BEGIN
    -- Only trigger if status changed to 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Determine winner and points
        IF NEW.home_score > NEW.away_score THEN
            points_home := 3;
            points_away := 0;
            home_win := 1;
            away_loss := 1;
        ELSIF NEW.home_score < NEW.away_score THEN
            points_home := 0;
            points_away := 3;
            home_loss := 1;
            away_win := 1;
        ELSE
            points_home := 1;
            points_away := 1;
            home_draw := 1;
            away_draw := 1;
        END IF;

        -- Update home team standings
        INSERT INTO public.standings (tournament_id, team_id, played, wins, draws, losses, goals_for, goals_against, points)
        VALUES (NEW.tournament_id, NEW.home_team_id, 1, home_win, home_draw, home_loss, NEW.home_score, NEW.away_score, points_home)
        ON CONFLICT (tournament_id, team_id) DO UPDATE SET
            played = public.standings.played + 1,
            wins = public.standings.wins + home_win,
            draws = public.standings.draws + home_draw,
            losses = public.standings.losses + home_loss,
            goals_for = public.standings.goals_for + NEW.home_score,
            goals_against = public.standings.goals_against + NEW.away_score,
            points = public.standings.points + points_home,
            updated_at = NOW();

        -- Update away team standings
        INSERT INTO public.standings (tournament_id, team_id, played, wins, draws, losses, goals_for, goals_against, points)
        VALUES (NEW.tournament_id, NEW.away_team_id, 1, away_win, away_draw, away_loss, NEW.away_score, NEW.home_score, points_away)
        ON CONFLICT (tournament_id, team_id) DO UPDATE SET
            played = public.standings.played + 1,
            wins = public.standings.wins + away_win,
            draws = public.standings.draws + away_draw,
            losses = public.standings.losses + away_loss,
            goals_for = public.standings.goals_for + NEW.away_score,
            goals_against = public.standings.goals_against + NEW.home_score,
            points = public.standings.points + points_away,
            updated_at = NOW();
            
        -- Recalculate positions for the tournament
        WITH ranked_standings AS (
            SELECT id, ROW_NUMBER() OVER (
                PARTITION BY tournament_id 
                ORDER BY points DESC, (goals_for - goals_against) DESC, goals_for DESC
            ) as new_position
            FROM public.standings
            WHERE tournament_id = NEW.tournament_id
        )
        UPDATE public.standings s
        SET position = rs.new_position
        FROM ranked_standings rs
        WHERE s.id = rs.id;

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for match complete
DROP TRIGGER IF EXISTS tr_update_standings ON public.matches;
CREATE TRIGGER tr_update_standings
AFTER UPDATE ON public.matches
FOR EACH ROW EXECUTE FUNCTION public.update_standings_on_match_complete();

-- Ensure unique constraint on tournament_id and team_id in standings
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'standings_tournament_id_team_id_key'
    ) THEN
        ALTER TABLE public.standings ADD CONSTRAINT standings_tournament_id_team_id_key UNIQUE (tournament_id, team_id);
    END IF;
END $$;
