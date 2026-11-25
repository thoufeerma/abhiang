// All the words on the page live here — edit freely.

export type Person = {
  key: "abhinav" | "angel";
  name: string;
  fullName: string;
  head: string;
  photo: string;
  tagline: string;
  facts: { emoji: string; text: string }[];
};

export const him: Person = {
  key: "abhinav",
  name: "Abhinav",
  fullName: "Abhinav Thaj",
  head: "/heads/abhinav.png",
  photo: "/photos/abhinav.jpeg",
  tagline: "Curly hair, don't care.",
  facts: [
    { emoji: "😁", text: "Smile that lights up a whole café" },
    { emoji: "🖤", text: "Black shirt + mundu = signature look" },
    { emoji: "🌀", text: "Every curl has its own personality" },
  ],
};

export const her: Person = {
  key: "angel",
  name: "Angel",
  fullName: "Angel Agna",
  head: "/heads/angel.png",
  photo: "/photos/angel.jpeg",
  tagline: "Literally named Angel. Lives up to it.",
  facts: [
    { emoji: "✨", text: "That nose ring sparkle though" },
    { emoji: "🤍", text: "Effortlessly cute in white" },
    { emoji: "☕", text: "Fluent in café hopping" },
  ],
};

export const hero = {
  kicker: "once upon a time, two little stickfolk…",
  title: ["Abhinav", "&", "Angel"],
  subtitle: "walked in from opposite sides — and sparks flew.",
};

export const story = [
  {
    title: "Two different sides",
    text: "He was over here. She was over there. The universe was taking notes.",
    scene: "apart",
  },
  {
    title: "And then… YAY!",
    text: "One hello. One smile. One very real spark.",
    scene: "spark",
  },
  {
    title: "Coffee & a million chats",
    text: "Café after café, laugh after laugh. Nobody counted the hours.",
    scene: "coffee",
  },
  {
    title: "Happily ever after",
    text: "Hand in hand, heads in the clouds, hearts in the right place.",
    scene: "together",
  },
] as const;

export const footer = {
  line: "Two heads. One heart. Zero chill.",
  signoff: "made with lots of love for Abhinav & Angel",
};

export const music = {
  /**
   * null = play the built-in music-box tune.
   * To use your own song: put e.g. "our-song.mp3" in /public and set file: "/our-song.mp3".
   */
  file: null as string | null,
  volume: 0.55,
};

export const intro = {
  button: "tap to begin",
  hint: "sound on ♪",
};
