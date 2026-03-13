

# Complete Player Registration Form

## Current State Analysis

The 4-step form has UI but several critical gaps:

1. **Step 1 (Personal Info)** — Fields work but no photo upload, no jersey number field
2. **Step 2 (Club & Position)** — Uses hardcoded clubs list instead of fetching teams from DB; missing jersey number and team assignment
3. **Step 3 (Documents)** — Upload buttons are visual-only (no actual file upload logic); no file state tracking or preview
4. **Step 4 (Guardian Info)** — Works but no validation for minors (should be required)
5. **No Step 5 (Review)** — No summary/review step before final submission
6. **Service layer** — `playerService.createPlayer()` is mock (in-memory), doesn't persist to database
7. **No validation** — No required field checks before advancing steps

## Plan

### 1. Add Step 5 — Review & Submit
- Add a 5th step to the stepper: "Review"
- Display read-only summary of all entered data (personal info, team, documents, guardian)
- Show warnings for missing required fields

### 2. Fetch teams from database (replace hardcoded clubs)
- In Step 2, query the `teams` table for the club/team selector
- Also add jersey number field to Step 2

### 3. Wire document uploads to storage
- Step 3: Connect "Upload Photo" to `player-photos` bucket
- Connect "Upload Document" and "Upload Record" to `documents` bucket
- Show file name + preview after upload; allow removal
- Track uploaded file URLs in form state

### 4. Add form validation per step
- Step 1: name, dateOfBirth, email required
- Step 2: team and primary position required
- Step 3: optional (but show warnings)
- Step 4: required if player is minor
- Show toast error if required fields missing when clicking "Next"

### 5. Wire playerService.createPlayer() to database
- Insert into `players` table via Supabase client
- Upload photo URL from storage
- Map form fields to DB columns (`team_id`, `organization_id`, etc.)

### Files to create/modify
- `src/modules/players/components/PlayerRegistrationForm.tsx` — major rewrite: add step 5, fetch teams, wire uploads, add validation
- `src/modules/players/services/playerService.ts` — replace mock `createPlayer` with Supabase insert

