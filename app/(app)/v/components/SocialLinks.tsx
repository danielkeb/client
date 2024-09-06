import Link from "next/link";
import {
  FaBehance,
  FaDribbble,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

export default function SocialLinks({
  socialLinks,
}: {
  socialLinks: Array<any>;
}) {
  const pickIcon = (platform: string) => {
    switch (platform) {
      case "Dribbble":
        return <FaDribbble size={20} />;
      case "LinkedIn":
        return <FaLinkedin size={20} />;
      case "GitHub":
        return <FaGithub size={20} />;
      case "Behance":
        return <FaBehance size={20} />;
      case "Instagram":
        return <FaInstagram size={20} />;
      case "Website":
        return <FaGlobe size={20} />;
      default:
        return;
    }
  };

  return (
    <div className="rounded-b border border-neutral/15 bg-base-100">
      <div className="card-body">
        <p className="mb-4">Social Links</p>

        <ul className="space-y-3 pl-4">
          {socialLinks?.map(
            (link: { platform: string; url: string }, index: number) => {
              return (
                <>
                  {link.url !== null && (
                    <li key={index} className="cursor-pointer hover:underline">
                      <Link
                        target="_blank"
                        href={link.url}
                        className="flex items-center gap-4"
                      >
                        {pickIcon(link.platform)}
                        <span className="text-lg">{link.url}</span>
                      </Link>
                    </li>
                  )}
                </>
              );
            },
          )}
        </ul>
      </div>
    </div>
  );
}
