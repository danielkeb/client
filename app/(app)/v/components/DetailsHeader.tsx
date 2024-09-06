import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";

export default function DetailsHeader({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  return (
    <Link href={href}>
      <div className="mb-3 flex items-center gap-4">
        <GoArrowLeft size={28} />
        <span className="text-xl">{text}</span>
      </div>
    </Link>
  );
}
