import React, { useState } from "react";
import type { AvatarCardProps } from "@/types";

const AvatarCard: React.FC<AvatarCardProps> = ({
  avatarUrl,
  name,
  title,
  backDetails,
  socials,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isIco = (icon: string) => icon.endsWith(".ico");
  const hasNonIcoIcon = socials.some((social) => !isIco(social.icon));

  return (
    <div className="w-60 h-64 p-3 border border-border dark:border-border rounded-xl relative md:block hidden bg-background dark:bg-background shadow-sm">
      {/* Avatar Section */}
      <div className="flex flex-col items-center">
        <div
          className="relative w-36 h-36 mt-1 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={avatarUrl}
            alt={name}
            className={`w-full h-full object-cover rounded-full transition-all duration-500 ${
              isHovered ? "scale-75 opacity-0" : "scale-100 opacity-100"
            }`}
            loading="lazy"
          />
          <div
            className={`absolute inset-0 flex flex-col justify-center px-3 transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {backDetails.map((detail, index) => (
              <p
                key={index}
                className="text-sm text-center py-1.5 text-foreground dark:text-foreground"
                style={{
                  opacity: isHovered ? "1" : "0",
                  transition: `opacity 0.5s ease-in-out ${index * 150}ms`,
                }}
              >
                {detail}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="absolute bottom-2 inset-x-0 px-3 py-2 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-foreground dark:text-foreground">
            {name}
          </h3>
          <p className="text-xs text-foreground/60 dark:text-foreground/60 truncate">
            {title}
          </p>
        </div>
        <div className="flex space-x-1">
          {socials.map((social, i) => (
            <a
              key={i}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-transform duration-200 hover:translate-y-[-2px] ${
                hasNonIcoIcon ? "w-5 h-5 rounded-md overflow-hidden" : ""
              }`}
              aria-label={social.name}
            >
              <img
                src={social.icon}
                alt={social.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export { AvatarCard };
