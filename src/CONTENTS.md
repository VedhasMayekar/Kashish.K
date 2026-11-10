# Probably Dora-Thor Universe — source index

- `src/data/memories.ts` — central data: intro, earphones, 9 letter scenes (exact text, Scene 9 credentials redacted), audio clips, memories, interests, timeline, little things, universe, final
- `src/components/` — StarfieldBackground, AudioPlayer, MemoryCard, MemoryGrid, Timeline, TimelineEvent, ProgressIndicator, SceneNavigation, Icon
- `src/scenes/` — IntroScene, EarphonesScene, LetterScene, MemoriesScene, TimelineScene, LittleThingsScene, InterestsScene, UniverseScene, FinalScene
- `src/App.tsx` — scene orchestration, keyboard/swipe navigation, progress
- `public/audio/voice-note.ogg` — locally supplied voice note (copied from the WhatsApp export); played only on explicit tap in Scene 7

## Run
npm install
npm run dev    -> open the shown localhost URL
npm run build   -> dist/ (open dist/index.html or serve dist/)
