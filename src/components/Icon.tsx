import {
  AudioLines, Candy, ChefHat, CircleDot, CupSoda, Flower2, Footprints,
  HandHeart, HeartHandshake, Laugh, MapPin, MessagesSquare, Mic, Orbit,
  ShieldCheck, ShoppingBag, Sparkles, TrainFront, Trees, Trophy, UtensilsCrossed, Waves,
  type LucideIcon,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  AudioLines, Candy, ChefHat, CircleDot, CupSoda, Flower2, Footprints,
  HandHeart, HeartHandshake, Laugh, MapPin, MessagesSquare, Mic, Orbit,
  ShieldCheck, ShoppingBag, Sparkles, TrainFront, Trees, Trophy, UtensilsCrossed, Waves,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = registry[name] ?? Sparkles;
  return <Cmp className={className} aria-hidden="true" />;
}
