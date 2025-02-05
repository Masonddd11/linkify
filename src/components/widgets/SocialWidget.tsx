import { SocialContent } from "@prisma/client";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const platformIcons = {
  github: FaGithub,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
};

export function SocialWidget({ content }: { content: SocialContent }) {
  const Icon =
    platformIcons[content.platform as keyof typeof platformIcons] || FaGithub;

  return (
    <a
      href={content.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-full flex items-center justify-center p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-6 h-6" />
        <span className="font-medium">{content.username}</span>
      </div>
    </a>
  );
}
