import { Facebook, Instagram, Youtube } from "lucide-react";
import { forwardRef } from "react";
import { Button } from "./ui/button";

interface SocialLinksProps {
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "default";
  showLabels?: boolean;
}

const TikTokIcon = forwardRef<SVGSVGElement, { className?: string }>(
  ({ className }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
);
TikTokIcon.displayName = "TikTokIcon";

export function SocialLinks({ size = "md", variant = "ghost", showLabels = false }: SocialLinksProps) {
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7"
  };

  const buttonSizes = {
    sm: "icon",
    md: "icon",
    lg: "icon"
  } as const;

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://instagram.com/teresopolis",
      icon: Instagram,
      color: "hover:text-pink-600"
    },
    {
      name: "Facebook",
      url: "https://facebook.com/teresopolis",
      icon: Facebook,
      color: "hover:text-blue-600"
    },
    {
      name: "TikTok",
      url: "https://tiktok.com/@teresopolis",
      icon: TikTokIcon,
      color: "hover:text-black dark:hover:text-white"
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@teresopolis",
      icon: Youtube,
      color: "hover:text-red-600"
    }
  ];

  if (showLabels) {
    return (
      <div className="flex flex-wrap gap-3">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${social.color} hover:bg-accent`}
            >
              <Icon className={iconSizes[size]} />
              <span className="text-sm font-medium">{social.name}</span>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <Button
            key={social.name}
            variant={variant}
            size={buttonSizes[size]}
            asChild
            className={`transition-colors ${social.color}`}
          >
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              title={social.name}
            >
              <Icon className={iconSizes[size]} />
              <span className="sr-only">{social.name}</span>
            </a>
          </Button>
        );
      })}
    </div>
  );
}
