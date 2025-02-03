import { PLATFORM } from "@prisma/client";
import {
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaTwitch,
  FaReddit,
  FaSoundcloud,
  FaSpotify,
  FaVk,
  FaDribbble,
} from "react-icons/fa";
import { IconType } from "react-icons";

export interface SocialPlatformConfig {
  id: PLATFORM;
  name: string;
  icon: IconType;
  color: string;
  placeholder: string;
  urlPattern: string;
}

export const socialPlatformConfigs: SocialPlatformConfig[] = [
  {
    id: PLATFORM.INSTAGRAM,
    name: "Instagram",
    icon: FaInstagram,
    color: "#E1306C",
    placeholder: "@username",
    urlPattern: "https://instagram.com/{username}",
  },
  {
    id: PLATFORM.TWITTER,
    name: "Twitter",
    icon: FaTwitter,
    color: "#1DA1F2",
    placeholder: "@username",
    urlPattern: "https://twitter.com/{username}",
  },
  {
    id: PLATFORM.TIKTOK,
    name: "TikTok",
    icon: FaTiktok,
    color: "#000000",
    placeholder: "@username",
    urlPattern: "https://tiktok.com/@{username}",
  },
  {
    id: PLATFORM.YOUTUBE,
    name: "YouTube",
    icon: FaYoutube,
    color: "#FF0000",
    placeholder: "Channel URL",
    urlPattern: "https://youtube.com/@{username}",
  },
  {
    id: PLATFORM.LINKEDIN,
    name: "LinkedIn",
    icon: FaLinkedin,
    color: "#0077B5",
    placeholder: "Profile URL",
    urlPattern: "https://linkedin.com/in/{username}",
  },
  {
    id: PLATFORM.GITHUB,
    name: "GitHub",
    icon: FaGithub,
    color: "#333",
    placeholder: "@username",
    urlPattern: "https://github.com/{username}",
  },
  {
    id: PLATFORM.FACEBOOK,
    name: "Facebook",
    icon: FaFacebook,
    color: "#1877F2",
    placeholder: "Profile URL",
    urlPattern: "https://facebook.com/{username}",
  },
  {
    id: PLATFORM.TWITCH,
    name: "Twitch",
    icon: FaTwitch,
    color: "#9146FF",
    placeholder: "Channel URL",
    urlPattern: "https://twitch.tv/{username}",
  },
  {
    id: PLATFORM.REDDIT,
    name: "Reddit",
    icon: FaReddit,
    color: "#FF4500",
    placeholder: "u/username",
    urlPattern: "https://reddit.com/user/{username}",
  },
  {
    id: PLATFORM.SOUNDCLOUD,
    name: "SoundCloud",
    icon: FaSoundcloud,
    color: "#FF3300",
    placeholder: "Profile URL",
    urlPattern: "https://soundcloud.com/{username}",
  },
  {
    id: PLATFORM.SPOTIFY,
    name: "Spotify",
    icon: FaSpotify,
    color: "#1DB954",
    placeholder: "Profile URL",
    urlPattern: "https://open.spotify.com/user/{username}",
  },
  {
    id: PLATFORM.VK,
    name: "VK",
    icon: FaVk,
    color: "#4A76A8",
    placeholder: "Profile URL",
    urlPattern: "https://vk.com/{username}",
  },
  {
    id: PLATFORM.DRIBBBLE,
    name: "Dribbble",
    icon: FaDribbble,
    color: "#EA4C89",
    placeholder: "Profile URL",
    urlPattern: "https://dribbble.com/{username}",
  },
];
