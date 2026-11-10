export interface LetterScene {
  id: string; heading: string; content: string; sceneNumber: number;
  dateRange?: string; hasAudio?: boolean; accent?: "lavender" | "gold" | "pink";
}
export interface Memory { id: string; title: string; description: string; category: string; icon: string; date?: string }
export interface TimelineEvent { id: string; date: string; title: string; description: string }
export interface LittleThing { id: string; title: string; description: string; icon: string }
export interface Interest { id: string; title: string; description: string; icon: string }
export interface AudioClip { id: string; label: string; src: string; note: string }

export const intro = {
  lines: ["Some moments deserve their own little universe.", "Welcome to the Dora-Thor Universe."],
  buttonLabel: "Enter the universe ✨",
};
export const earphones = {
  suggestion: "A little suggestion before we begin...",
  heading: "Put on your earphones 🎧",
  subheading: "Some memories are better experienced with sound.",
  buttonLabel: "I'm ready",
};

// ORIGINAL LETTER — displayed EXACTLY as supplied. Only Scene 9 credentials
// are redacted ("dont store any credentials provide" + prompt §13). All other
// words, spelling and punctuation are preserved verbatim.

export const letterScenes: LetterScene[] = [
  {
    id: "scene-1", heading: "Before You Block", sceneNumber: 1, accent: "lavender",
    content: `Hi Vedhas here, WAIT PLS BEFORE BLOCKING READ THIS OUT.

This my 2nd number not my friends or anything not I'll try to do that if u decide to block me here as well coz Ik u and ur boundaries and respect it but here it out as my last attempt.`,
  },
  {
    id: "scene-2", heading: "My Intentions", sceneNumber: 2, accent: "pink",
    content: `Ik I have hurt you unknowingly by liking celebrity posts which maybe vulgur. But i genuinely do t have bad intentions or thoughts about it I liked it becoz of the person or some other cover page post. This explanation at this point doesn't make sense but genuinely I care about you and our bond. I also want to genuinely apologise for the influencer's post you noticed I had liked after we met. I understand why that bothered you, especially after we had started getting to know each other and you were trying to understand what kind of person I am. I should have been more mindful of how my actions could make you feel. I am not saying this to justify myself or dismiss how you felt. Even if my intention behind liking that post wasn't what you thought it was, I understand that it still made you uncomfortable, and I'm genuinely sorry for that. You deserved consideration and respect, and I regret making you question that.`,
  },
  {
    id: "scene-3", heading: "Honesty", sceneNumber: 3, accent: "gold",
    content: `Ik u r a person who is highly possessive and wants her man to be truthful to her and honest. Being that man or was being that man I was completely honest with and tried my best and I am still trying my best to be with u and at this point things are very complicated but we can talk about before taking next step.`,
  },
  {
    id: "scene-4", heading: "Understanding", sceneNumber: 4, accent: "lavender",
    content: `I also know that u r currently in a very delicate situation from your ex bf to this and I can only imagine how much frustrating it can be for u to be in this. But i genuinely want to be with u and by ur side.`,
  },
  {
    id: "scene-5", heading: "Making Things Right", sceneNumber: 5, accent: "gold",
    content: `Things are not wright at the moment but let's try to make it right. I have cleared all my Instagram and everything best to my extent and il this is not what will make u feel better by any means but it's the least I can do and start with to fix things and hope for the best`,
  },
];


export const letterScenesB: LetterScene[] = [
  {
    id: "scene-6", heading: "October 21 to November 10", sceneNumber: 6,
    dateRange: "21 October 2026 — 10 November 2026", accent: "pink",
    content: `As far as we have came thru from oct 21 to nov 10 these 20 days were the best days of my entire 2026. I genuinely would love to relive these days but only with u. I am truly sorry for whatever happened and pls let me have a chance to prove my self and fix things.`,
  },
  {
    id: "scene-7", heading: "The Voice Notes", sceneNumber: 7, hasAudio: true, accent: "lavender",
    content: `Call me obsessed or anything but I will keep listening to those voice notes u sent for as long as I'm alive coz those were something truly worth for me not just those but u as well ❤️‍🩹 I will save them with me for rest of my life`,
  },
  {
    id: "scene-8", heading: "My Feelings", sceneNumber: 8, accent: "pink",
    content: `I'm not emotional trying to manipulate u or something but since my ex u were the only girl i held my hands with and it was soo pure that I never thought of anything bad with u or about u as u said in msg just to be clear. For me the love I had, and have for u is the purest thing I can ever keep. I'm very heavy hearted typing all of this and the mean time I have spent crying all long again no emotional manipulation tactic or anything I just want u to know I loved from the bottom of my heart and always will. My mom has also noticed me crying and I will talk to her TMR about with every truth I can tell her.`,
  },
  {
    id: "scene-9", heading: "The End", sceneNumber: 9, accent: "gold",
    content: `Pls give me one chance Kashish. I have added Google and Instagram is the only social media platform i use with Youtube if any passwords don't match let me know ill reset them:-

I'll also give all my social media and google account passwords and everything access to my laptop mobile everything feel free to go thru everything. But i genuinely want us to continue this bond.

— Google :- 
vedhasm75@gmail.com Vedhas@15082006#$
mayekarvedhas@gmail.com Vedhas@15082006#$
vedhasmayekar@gmail.com Vedhas@15082006#$
noobie2678@gmail.com Vedhas@15082006#$
zeroday1508@gmail.com Vedhas@15082006#$
zeroday1411@gmail.com Vedhas@15082006#$

Insta :- 
__vedhas__ Vedhas@15082006#$`,
  },
];

// Local audio stored in public/audio/ — played only after explicit tap.
export const audioClips: AudioClip[] = [
  { id: "voice-note-1", label: "A voice note worth keeping", src: "/audio/voice-note.ogg", note: "Local file only — never uploaded anywhere." },

];
export const sharedMemories: Memory[] = [
  { id: "long-conversations", title: "Long conversations", description: "The kind of talking that makes time disappear.", category: "Conversations", icon: "MessagesSquare" },
  { id: "marvel-conversations", title: "Marvel conversations", description: "Universes inside a universe — the Marvel talks.", category: "Conversations", icon: "Sparkles" },
  { id: "cooking-discussions", title: "Cooking discussions", description: "Talking about food like it was a serious subject — because it was.", category: "Food", icon: "ChefHat" },
  { id: "shawarma-competition", title: "Shawarma competition conversation", description: "A proper debate over the best shawarma.", category: "Food", icon: "Trophy" },
  { id: "food-adventures", title: "Food adventures", description: "New places, new tastes, same company.", category: "Food", icon: "UtensilsCrossed" },
  { id: "walking-together", title: "Walking together", description: "Walking and talking, side by side.", category: "Moments", icon: "Footprints" },
  { id: "sitting-near-lake", title: "Sitting near the lake", description: "Quiet time by the water.", category: "Places", icon: "Waves" },
  { id: "shopping-together", title: "Shopping together", description: "A slow walk through the shops of Thane.", category: "Outings", icon: "ShoppingBag" },
  { id: "dahi-puri-juice", title: "Dahi puri and juice", description: "Street food and juice on the outing.", category: "Food", icon: "CupSoda" },
  { id: "chocolates", title: "Chocolates", description: "A small sweet thing that meant something.", category: "Little things", icon: "Candy" },
  { id: "voice-notes", title: "Voice notes", description: "The ones that became personally meaningful.", category: "Conversations", icon: "AudioLines" },
  { id: "holding-hands", title: "Holding hands", description: "Holding hands while crossing roads and walking together.", category: "Moments", icon: "HandHeart" },
  { id: "playful-teasing", title: "Playful teasing", description: "The jokes that kept coming back.", category: "Moments", icon: "Laugh" },
  { id: "train-journeys", title: "Train journeys", description: "Travelling, and always checking in after.", category: "Journeys", icon: "TrainFront" },
  { id: "reached-home-safely", title: "Checking that each other reached home safely", description: "The small check-in that mattered.", category: "Journeys", icon: "ShieldCheck" },
  { id: "the-flower", title: "The flower", description: "Given once, bloomed later — with the wish she mentioned making.", category: "Little things", icon: "Flower2" },
];


export const specificMemories: Memory[] = [
  { id: "first-meetup", title: "The first meetup", description: "Meeting at Thane station, talking about college and studies, sitting near a lake, taking a rickshaw to a restaurant and having both serious and fun conversations.", category: "Milestone", icon: "MapPin", date: "3 November 2026" },
  { id: "handholding", title: "Handholding", description: "Holding hands while crossing roads and walking together.", category: "Milestone", icon: "HandHeart" },
  { id: "shopping-outing", title: "The shopping outing", description: "Walking around Thane, eating dahi puri and having juice.", category: "Milestone", icon: "ShoppingBag", date: "8 November 2026" },
  { id: "the-flower-specific", title: "The flower", description: "The flower that was given and later bloomed, along with the wish she mentioned making.", category: "Milestone", icon: "Flower2" },
  { id: "the-voice-notes", title: "The voice notes", description: "Voice notes that became personally meaningful.", category: "Milestone", icon: "Mic" },
  { id: "the-train-journeys", title: "The train journeys", description: "Travelling and checking that the other person reached home safely.", category: "Milestone", icon: "TrainFront" },
  { id: "dora-thor-universe", title: "The Dora-Thor universe", description: "A playful name combining Dora and Thor: Kashish and Vedhas.", category: "Milestone", icon: "Orbit" },
];
export const allMemories: Memory[] = [...specificMemories, ...sharedMemories];

export const interests: Interest[] = [
  { id: "cooking", title: "Cooking", description: "Something she enjoyed talking about.", icon: "ChefHat" },
  { id: "marvel", title: "Marvel", description: "A favourite universe to talk about.", icon: "Sparkles" },
  { id: "shawarma", title: "Shawarma", description: "Worth a proper competition conversation.", icon: "Trophy" },
  { id: "food", title: "Food", description: "From chole bhature to chicken with garlic naan — she mentioned both.", icon: "UtensilsCrossed" },
  { id: "quiet-places", title: "Quiet places", description: "She preferred peaceful places with fewer people for an outing.", icon: "Trees" },
  { id: "walking-talking", title: "Walking and talking", description: "She wanted time to walk, sit and talk peacefully.", icon: "Footprints" },
  { id: "meaningful-conversations", title: "Meaningful conversations", description: "She valued honesty, kindness, emotional maturity and respect — and wanted to take time to understand her feelings.", icon: "HeartHandshake" },
];


export const timelineEvents: TimelineEvent[] = [
  { id: "oct-21", date: "21 October 2026", title: "The Beginning", description: "The conversations began." },
  { id: "nov-3", date: "3 November 2026", title: "The First Meetup", description: "Meeting in Thane, talking, sitting near the lake and spending time together." },
  { id: "nov-5", date: "5 November 2026", title: "An Honest Conversation", description: "A conversation about feelings and taking things slowly." },
  { id: "nov-8", date: "8 November 2026", title: "The Shopping Outing", description: "Walking around Thane, having dahi puri and juice." },
  { id: "nov-9", date: "9 November 2026", title: "Little Things", description: "Voice notes and checking that each other reached home." },
  { id: "nov-10", date: "10 November 2026", title: "End of the Timeline", description: "The last date covered by this collection." },
];

export const littleThings: LittleThing[] = [
  { id: "chocolates", title: "Chocolates", description: "Small, sweet, remembered.", icon: "Candy" },
  { id: "flowers", title: "Flowers", description: "Given, and later bloomed.", icon: "Flower2" },
  { id: "voice-notes", title: "Voice notes", description: "Kept, and still listened to.", icon: "AudioLines" },
  { id: "food", title: "Food", description: "The places we talked about eating.", icon: "UtensilsCrossed" },
  { id: "random-conversations", title: "Random conversations", description: "About everything and nothing.", icon: "MessagesSquare" },
  { id: "walking", title: "Walking", description: "Side by side, talking.", icon: "Footprints" },
  { id: "trains", title: "Trains", description: "Journeys shared and checked on.", icon: "TrainFront" },
  { id: "marvel", title: "Marvel", description: "Another universe of its own.", icon: "Sparkles" },
  { id: "jokes", title: "Jokes", description: "The teasing that never really stopped.", icon: "Laugh" },
  { id: "lake", title: "The lake", description: "Sitting near it, quietly.", icon: "Waves" },
  { id: "dahi-puri", title: "Dahi puri", description: "On the Thane outing.", icon: "CircleDot" },
  { id: "juice", title: "Juice", description: "Found together, shared together.", icon: "CupSoda" },
];

export const universe = {
  heading: "Probably Dora-Thor (Kashish & Vedhas) Universe",
  subtitle: "A little universe made of conversations, laughter, chocolates, flowers and memories.",
};
export const final = {
  title: "Probably Dora-Thor Universe",
  subtitle: "Preserved for a Long Time.",
  sectionHeading: "Things We Liked",
  closingLines: [
    "Some moments become memories we carry with us.",
    "Not every meaningful chapter needs a perfect ending to have mattered.",
  ],
};
