import { Heart, Send } from "lucide-react";

export const limit_tracks = 6;

// fill 
export const COMMUNITY_LINKS = [
  {
    id: "boosty",
    title: "Support the Project",
    description: "Help us keep the music ad-free",
    icon: <Heart fill="currentColor" size={24} />,
    buttonText: "Donate",
    href: "",
  },
  {
    id: "telegram",
    title: "Join our Telegram",
    description: "News, updates & exclusive mixes",
    icon: <Send size={24} />,
    buttonText: "Join",
    href: "https://t.me/",
  },
];