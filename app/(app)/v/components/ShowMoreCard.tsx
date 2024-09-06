import Link from "next/link";
import { GoArrowRight } from "react-icons/go";

export default function ShowMoreCard({ href }: { href: string }) {
  return (
    <div className="rounded-b border border-t-0 border-neutral/15 bg-base-100 px-4 py-2 text-sm font-light hover:bg-base-200/20">
      {/* <div className="card-body"> */}
      <Link href={href} className="flex flex-row items-center justify-between">
        <span>Show more</span>
        <GoArrowRight size={20} />
      </Link>
      {/* </div> */}
    </div>
  );
}
