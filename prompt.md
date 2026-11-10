# PROJECT: PROBABLY DORA-THOR UNIVERSE
## Cinematic Interactive Personal Memory Website

You are an expert frontend developer, UI/UX designer, creative director and motion designer.

Build a premium, cinematic, emotionally expressive and fully responsive interactive website titled:

# Probably Dora-Thor (Kashish & Vedhas) Universe

The website is a private personal memory project containing an original letter, personal reflections and memories from October 21, 2026 to November 10, 2026.

The experience should feel like entering a small universe made of memories.

**MOST IMPORTANT CONTENT RULE:**

The original letter provided below is user-authored content.

- Do NOT rewrite it.
- Do NOT paraphrase it.
- Do NOT correct its grammar.
- Do NOT correct spelling mistakes.
- Do NOT change punctuation.
- Do NOT change capitalization.
- Do NOT remove words.
- Do NOT shorten sentences.
- Do NOT change Hinglish expressions.
- Do NOT replace the user's wording with professional or polished language.
- Do NOT modify the emotional tone.
- Preserve every original sentence exactly as provided.
- Only add separate scene headings, visual elements and navigation outside the original text.

The letter must be displayed exactly as supplied.

This is a private, unsent project. Do not add any functionality to contact, notify, message, share with or bypass the boundaries of another person. Do not deploy or publish automatically.

---

# 1. TECHNOLOGY STACK

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React icons

Use clean, reusable components and modular architecture.

All content must be stored centrally in:

`src/data/memories.ts`

Do not hardcode the letter, timeline, memory cards or descriptions throughout individual components.

Keep the original letter as a single source of truth in this file.

Create separate data structures for:

1. Original letter scenes
2. Shared memories
3. Her interests
4. Timeline events
5. Little details
6. Website introduction and closing text
7. Optional locally supplied audio files

---

# 2. DESIGN DIRECTION

The website should feel like entering a cinematic galaxy.

Visual style:

- Cinematic
- Dreamy
- Romantic but understated
- Deep-space atmosphere
- Elegant typography
- Soft animations
- Premium editorial design
- Emotionally expressive

Colour palette:

- Deep midnight navy
- Black
- Dark purple
- Muted lavender
- Soft white
- Subtle pink highlights
- Warm golden stars

Avoid:

- Excessive bright pink
- Cheap-looking gradients
- Too many hearts
- Cartoonish layouts
- Generic Valentine's Day templates
- Overly dramatic animations

Background effects:

- Slowly moving stars
- Subtle nebula effects
- Floating particles
- Gentle glow effects
- Occasional shooting stars
- Smooth parallax movement
- Subtle constellation effects

Make the experience mobile-first.

Typography:

- Elegant serif font for emotional headings.
- Modern sans-serif font for body text.
- Large, cinematic typography for scene titles.
- Comfortable line spacing for the original letter.
- Excellent readability on mobile devices.

The original letter must never be visually compressed into tiny text.

---

# 3. WEBSITE FLOW

Create a full-screen scene-based experience.

There should be 9 main letter scenes, preceded by the introduction and earphones screen.

Use Framer Motion for transitions.

Provide:

- Next and previous navigation
- Progress indicator
- Smooth fade transitions
- Keyboard navigation
- Mobile swipe navigation where practical
- Reduced-motion accessibility
- Optional skip navigation
- Scene numbering

Do not make the experience one enormous scrolling page.

Each scene should feel like a separate chapter.

## SCENE 0 — INTRODUCTION

Visual:

A nearly black screen with a slowly appearing galaxy.

Text:

"Some moments deserve their own little universe."

Then:

"Welcome to the Dora-Thor Universe."

Button:

"Enter the universe ✨"

Transition into the next scene when clicked.

## SCENE 0.5 — EARPHONES SUGGESTION

Show a minimal animated illustration of headphones or earphones.

Display:

"A little suggestion before we begin..."

"Put on your earphones 🎧"

"Some memories are better experienced with sound."

Button:

"I'm ready"

Requirements:

- Never autoplay audio.
- Never request microphone access.
- Do not request unnecessary permissions.
- Audio must play only after explicit user interaction.
- Include play/pause and mute controls.
- Audio files must be locally supplied.
- Do not upload private voice notes to public storage.
- Do not include anyone's private recordings without appropriate consent.
- If no audio files exist, gracefully skip the audio player.

## SCENE 1 — BEFORE YOU BLOCK

Visual direction:

- Nearly black background.
- A small glowing envelope in the centre.
- A subtle opening animation.
- Letter text appears line by line.
- Do not animate individual words in a way that makes reading difficult.

Heading:

"Before You Block"

Display the following original content exactly. Do not alter a single word.

Hi Vedhas here, WAIT PLS BEFORE BLOCKING READ THIS OUT.

This my 2nd number not my friends or anything not I'll try to do that if u decide to block me here as well coz Ik u and ur boundaries and respect it but here it out as my last attempt.

## SCENE 2 — MY INTENTIONS

Visual direction:

- Deep purple nebula.
- Gentle floating particles.
- A soft spotlight behind the text.
- Slow fade-in.

Heading:

"My Intentions"

Original content:

Ik I have hurt you unknowingly by liking celebrity posts which maybe vulgur. But i genuinely do t have bad intentions or thoughts about it I liked it becoz of the person or some other cover page post. This explanation at this point doesn't make sense but genuinely I care about you and our bond. I also want to genuinely apologise for the influencer's post you noticed I had liked after we met. I understand why that bothered you, especially after we had started getting to know each other and you were trying to understand what kind of person I am. I should have been more mindful of how my actions could make you feel. I am not saying this to justify myself or dismiss how you felt. Even if my intention behind liking that post wasn't what you thought it was, I understand that it still made you uncomfortable, and I'm genuinely sorry for that. You deserved consideration and respect, and I regret making you question that.

## SCENE 3 — HONESTY

Visual direction:

- A constellation gradually forming.
- Elegant typography.
- Subtle golden stars.
- A calm, dark navy atmosphere.

Heading:

"Honesty"

Original content:

Ik u r a person who is highly possessive and wants her man to be truthful to her and honest. Being that man or was being that man I was completely honest with and tried my best and I am still trying my best to be with u and at this point things are very complicated but we can talk about before taking next step.

## SCENE 4 — UNDERSTANDING

Visual direction:

- A distant galaxy.
- Slow-moving stars.
- Soft purple light.
- Gentle fade transitions.

Heading:

"Understanding"

Original content:

I also know that u r currently in a very delicate situation from your ex bf to this and I can only imagine how much frustrating it can be for u to be in this. But i genuinely want to be with u and by ur side.

## SCENE 5 — MAKING THINGS RIGHT

Visual direction:

- A dimly glowing galaxy.
- Stars gradually becoming brighter.
- Subtle visual transition from darkness to light.

Heading:

"Making Things Right"

Original content:

Things are not wright at the moment but let's try to make it right. I have cleared all my Instagram and everything best to my extent and il this is not what will make u feel better by any means but it's the least I can do and start with to fix things and hope for the best

## SCENE 6 — OCTOBER 21 TO NOVEMBER 10

Visual direction:

- A cinematic timeline.
- Two dates appearing on opposite sides.
- A glowing line connecting them.
- Floating stars and subtle particles.

Heading:

"October 21 to November 10"

Date:

21 October 2026 — 10 November 2026

Original content:

As far as we have came thru from oct 21 to nov 10 these 20 days were the best days of my entire 2026. I genuinely would love to relive these days but only with u. I am truly sorry for whatever happened and pls let me have a chance to prove my self and fix things.

## SCENE 7 — THE VOICE NOTES

Visual direction:

- Dark purple background.
- Minimal audio waveform animation.
- A glowing audio player.
- Subtle sound-wave movement.

Heading:

"The Voice Notes"

Original content:

Call me obsessed or anything but I will keep listening to those voice notes u sent for as long as I'm alive coz those were something truly worth for me not just those but u as well ❤️‍🩹 I will save them with me for rest of my life

Audio player requirements:

- Play/pause.
- Progress bar.
- Elapsed time.
- Duration.
- Volume control.
- Optional waveform.
- Local audio files only.
- No autoplay.
- Do not include or distribute private recordings without appropriate consent.

If no audio file is supplied, display the original text without an empty or broken audio player.

## SCENE 8 — MY FEELINGS

Visual direction:

- A quiet galaxy.
- Minimal stars.
- Soft lavender and white lighting.
- Slow text fade-in.
- A calm, cinematic atmosphere.

Heading:

"My Feelings"

Original content:

I'm not emotional trying to manipulate u or something but since my ex u were the only girl i held my hands with and it was soo pure that I never thought of anything bad with u or about u as u said in msg just to be clear. For me the love I had, and have for u is the purest thing I can ever keep. I'm very heavy hearted typing all of this and the mean time I have spent crying all long again no emotional manipulation tactic or anything I just want u to know I loved from the bottom of my heart and always will. My mom has also noticed me crying and I will talk to her TMR about with every truth I can tell her.

## SCENE 9 — THE END

Visual direction:

- The most cinematic scene.
- A large glowing galaxy.
- Subtle orbiting celestial objects.
- Slow-moving stars.
- Elegant final typography.

Heading:

"The End"

Original content:

Pls give me one chance Kashish. I have added Google and Instagram is the only social media platform i use with Youtube if any passwords don't match let me know ill reset them:-

I'll also give all my social media and google account passwords and everything access to my laptop mobile everything feel free to go thru everything. But i genuinely want us to continue this bond.

Google :- 
vedhasm75@gmail.com Vedhas@15082006#$
mayekarvedhas@gmail.com Vedhas@15082006#$
vedhasmayekar@gmail.com Vedhas@15082006#$
noobie2678@gmail.com Vedhas@15082006#$
zeroday1508@gmail.com Vedhas@15082006#$
zeroday1411@gmail.com Vedhas@15082006#$

Insta :- 
__vedhas__ Vedhas@15082006#$

The labels above are only placeholders in the original letter. Do not ask for, collect, embed, store or display actual passwords, recovery codes or account credentials in the website or source code. The user will manage account details separately, and should not share passwords.

The original letter text must remain unchanged.

---

# 4. THE MEMORY UNIVERSE

After the letter scenes, create an additional interactive memory section.

Heading:

"The Things That Made This Little Universe"

Create individual animated cards for the following memories.

### Shared experiences

1. Long conversations
2. Marvel conversations
3. Cooking discussions
4. Shawarma competition conversation
5. Food adventures
6. Walking together
7. Sitting near the lake
8. Shopping together
9. Dahi puri and juice
10. Chocolates
11. Voice notes
12. Holding hands
13. Playful teasing
14. Train journeys
15. Checking that each other reached home safely
16. The flower

Each card should contain:

- A tasteful icon.
- A title.
- A short description.
- A subtle hover/tap animation.
- A category label.

Do not invent conversations or events.

### Specific memories

**The first meetup**

Meeting at Thane station, talking about college and studies, sitting near a lake, taking a rickshaw to a restaurant and having both serious and fun conversations.

**Handholding**

Holding hands while crossing roads and walking together.

**The shopping outing**

Walking around Thane, eating dahi puri and having juice.

**The flower**

The flower that was given and later bloomed, along with the wish she mentioned making.

**The voice notes**

Voice notes that became personally meaningful.

**The train journeys**

Travelling and checking that the other person reached home safely.

**The Dora-Thor universe**

A playful name combining Dora and Thor: Kashish and Vedhas.

---

# 5. HER INTERESTS

Create a separate scene titled:

"A Few Things She Enjoyed Talking About"

Display:

- Cooking
- Marvel
- Shawarma
- Food
- Quiet places
- Walking and talking
- Meaningful conversations

Additional details:

- She mentioned chole bhature.
- She mentioned chicken with garlic naan.
- She preferred peaceful places with fewer people for an outing.
- She wanted time to walk, sit and talk peacefully.
- She valued honesty, kindness, emotional maturity and respect.
- She wanted to take time to understand her feelings.

IMPORTANT:

Present these as interests and preferences she mentioned. Do not incorrectly label every interest as a shared experience.

---

# 6. THE TIMELINE

Create an interactive cinematic timeline.

Use these events:

**21 October 2026 — The Beginning**

The conversations began.

**3 November 2026 — The First Meetup**

Meeting in Thane, talking, sitting near the lake and spending time together.

**5 November 2026 — An Honest Conversation**

A conversation about feelings and taking things slowly.

**8 November 2026 — The Shopping Outing**

Walking around Thane, having dahi puri and juice.

**9 November 2026 — Little Things**

Voice notes and checking that each other reached home.

**10 November 2026 — End of the Timeline**

The last date covered by this collection.

Only use dates that are supported by the supplied data. Do not invent dates for memories without a confirmed date.

Clicking a timeline event should reveal a small description card.

---

# 7. THE LITTLE DETAILS

Create a dedicated scene titled:

"It's Always the Little Things."

Display individual cards for:

- Chocolates
- Flowers
- Voice notes
- Food
- Random conversations
- Walking
- Trains
- Marvel
- Jokes
- The lake
- Dahi puri
- Juice

Use elegant Lucide icons and minimal illustrations.

---

# 8. THE DORA-THOR UNIVERSE

This must be one of the most visually impressive scenes.

Create an animated galaxy.

Visual concept:

- Two celestial objects orbiting a shared centre.
- A constellation connecting them.
- A deep purple and midnight navy galaxy.
- Tiny golden stars.
- Soft nebula glow.
- Slow, smooth movement.

Heading:

"Probably Dora-Thor (Kashish & Vedhas) Universe"

Subtitle:

"A little universe made of conversations, laughter, chocolates, flowers and memories."

The design should feel like a little universe preserved in time.

Do not imply a current relationship or an obligation for either person to continue the connection.

---

# 9. FINAL PAGE

Create a cinematic final scene.

Large title:

"Probably Dora-Thor Universe"

Subtitle:

"Preserved for a Long Time."

Section heading:

"Things We Liked"

Display the memory cards in an elegant responsive grid.

Final text:

"Some moments become memories we carry with us."

Then:

"Not every meaningful chapter needs a perfect ending to have mattered."

End with a slow fade into a star-filled night sky.

---

# 10. COMPONENT ARCHITECTURE

Create reusable components:

- IntroScene
- EarphonesScene
- LetterScene
- LetterRenderer
- MemoryCard
- MemoryGrid
- Timeline
- TimelineEvent
- LittleThingsScene
- InterestsScene
- UniverseScene
- FinalScene
- ProgressIndicator
- SceneNavigation
- StarfieldBackground
- AudioPlayer

Suggested project structure:

src/
  components/
    AudioPlayer.tsx
    LetterRenderer.tsx
    MemoryCard.tsx
    MemoryGrid.tsx
    Timeline.tsx
    TimelineEvent.tsx
    StarfieldBackground.tsx
    ProgressIndicator.tsx
    SceneNavigation.tsx

  data/
    memories.ts

  scenes/
    IntroScene.tsx
    EarphonesScene.tsx
    LetterScene.tsx
    MemoriesScene.tsx
    TimelineScene.tsx
    LittleThingsScene.tsx
    InterestsScene.tsx
    UniverseScene.tsx
    FinalScene.tsx

  App.tsx
  index.css
  main.tsx

public/
  audio/
  images/

---

# 11. CONTENT FILE REQUIREMENTS

Create:

`src/data/memories.ts`

This must contain:

- The complete original letter.
- Each of the nine letter scenes.
- Scene headings.
- Timeline events.
- Memory card descriptions.
- Her interests.
- Little details.
- Introduction and closing text.
- Optional local audio file references.

Use TypeScript interfaces.

Example:

interface LetterScene {
  id: string;
  heading: string;
  content: string;
  sceneNumber: number;
}

interface Memory {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  date?: string;
}

The letter content must be stored as exact string values.

Do not transform the text through a grammar correction library, AI rewriting system, formatter or text-processing utility.

Use the exact source strings for display.

The scene renderer must preserve:

- Paragraph breaks.
- Punctuation.
- Capitalization.
- Emojis.
- Spelling.
- Original wording.

Only scene headings and surrounding interface text may be separately authored.

---

# 12. ANIMATIONS

Use Framer Motion for:

- Slow fade-in text.
- Staggered card appearance.
- Gentle floating stars.
- Galaxy rotation.
- Shooting stars.
- Smooth scene transitions.
- Subtle card hover effects.
- Timeline reveal.
- Gentle text blur-to-focus transitions.
- Envelope opening animation.
- Audio waveform animation.

Animations should be smooth, elegant and lightweight.

Avoid:

- Aggressive zooming.
- Constant flashing.
- Excessive bouncing.
- Overly long transitions.
- Animations that prevent navigation.
- Effects that reduce text readability.

Respect `prefers-reduced-motion`.

---

# 13. PRIVACY AND SECURITY

This is a private personal memory project.

Requirements:

- No analytics.
- No tracking pixels.
- No third-party data collection.
- No contact forms.
- No messaging functionality.
- No automatic email or notification.
- No social media integrations.
- No password collection.
- No account credential storage.
- No account-access functionality.
- No public upload of private voice notes.
- No automatic deployment.
- No external delivery or sharing mechanism.

Do not put passwords, recovery codes or authentication tokens in source files.

Keep the project local by default.

Do not publish or deploy without explicit review and consent.

---

# 14. RESPONSIVENESS AND ACCESSIBILITY

The website must work on:

- Desktop.
- Laptop.
- Android.
- iPhone.
- Tablet.

Requirements:

- No horizontal overflow.
- Accessible text contrast.
- Semantic HTML.
- Proper button labels.
- Keyboard-accessible navigation.
- Reduced-motion support.
- Comfortable font sizes.
- Responsive letter typography.
- Touch-friendly controls.
- No layout shifts.

---

# 15. DEVELOPMENT INSTRUCTIONS

First inspect the existing project.

Then:

1. Set up the project if required.
2. Install necessary dependencies.
3. Create the folder architecture.
4. Build the scene navigation system.
5. Create the content file.
6. Insert the original letter exactly as provided.
7. Verify that no original words have been changed.
8. Build the reusable components.
9. Add the galaxy background.
10. Implement all letter scenes.
11. Implement the memory universe.
12. Add the timeline.
13. Add the earphones introduction.
14. Add the optional audio player.
15. Add all transitions and animations.
16. Implement responsive styling.
17. Test all navigation.
18. Run the TypeScript checks.
19. Run the production build.
20. Fix all errors.

Do not stop after generating a basic landing page.

The finished website should feel like a carefully designed cinematic interactive experience.

## FINAL NON-NEGOTIABLE INSTRUCTION

The original letter is the most important content.

**DO NOT CHANGE ITS WORDS.**

Not even one word.

Do not correct the spelling of "vulgur", "wright", "thru", "coz", "tatic", "addedy" or any other original expression.

Do not replace "u" with "you", "i" with "I", or "pls" with "please".

Do not polish the letter.

Do not make it sound more professional.

Do not remove emotional expressions.

Preserve the exact original user-provided content, scene by scene.

Only the visual presentation, layout, animation, navigation and separately authored website interface may be improved.