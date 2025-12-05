import React from "react";

// 1) Lucide React – clean generic social icons
import {
  Instagram,
  Youtube,
  X,        // Twitter / X
  Chrome,   // Google-ish
  Facebook,
  Linkedin,
  AtSign    // for Threads
} from "lucide-react";

// 2) Simple Icons via react-icons – brand logos
import {
  SiTiktok,
  SiReddit,
  SiVimeo
} from "react-icons/si";

// --------------------------------------------------------
//  MAIN SOCIAL ICON COMPONENTS (used across the app)
//  All accept `className` so you can control w/h outside.
// --------------------------------------------------------

export const InstagramIcon = ({ className = "" }) => (
  <Instagram className={`${className} text-pink-500`} />
);

export const YoutubeIcon = ({ className = "" }) => (
  <Youtube className={`${className} text-red-500`} />
);

export const TwitterIcon = ({ className = "" }) => (
  <X className={`${className} text-white`} />
);

export const GoogleIcon = ({ className = "" }) => (
  <Chrome className={`${className} text-red-500`} />
);

export const FacebookIcon = ({ className = "" }) => (
  <Facebook className={`${className} text-blue-600`} />
);

// Threads -> @ inside black circle
export const ThreadsIcon = ({ className = "" }) => (
  <AtSign
    className={`
      ${className}
      text-white bg-black rounded-full p-1
    `}
  />
);

export const LinkedinIcon = ({ className = "" }) => (
  <Linkedin className={`${className} text-blue-400`} />
);

// TikTok from Simple Icons
export const TiktokIcon = ({ className = "" }) => (
  <SiTiktok className={`${className} text-white`} />
);

// Reddit from Simple Icons
export const RedditIcon = ({ className = "" }) => (
  <SiReddit className={`${className} text-orange-500`} />
);

// Vimeo from Simple Icons
export const VimeoIcon = ({ className = "" }) => (
  <SiVimeo className={`${className} text-blue-500`} />
);

// Pinterest – custom: white P on red circle
export const PinterestIcon = ({ className = "" }) => (
  <span
    className={`
      ${className}
      flex items-center justify-center
      bg-red-600 text-white 
      rounded-full font-bold
    `}
    style={{
      fontSize: "1rem",
      lineHeight: 1,
      userSelect: "none",
    }}
  >
    P
  </span>
);
