import BronzeBadge from "@/public/img/Bronze.png";
import DiamondBadge from "@/public/img/Diamond.png";
import GoldBadge from "@/public/img/Gold.png";
import PlatinumBadge from "@/public/img/Platinum.png";
import SilverBadge from "@/public/img/Silver.png";
import { formatDate } from "date-fns";
import Image from "next/image";

export default function BadgeCard({
  badge,
  size,
}: {
  badge: any;
  size: "sm" | "lg";
}) {
  const pickBadgeType = (badgeName: any) => {
    switch (badgeName) {
      case "Bronze":
        return BronzeBadge;
      case "Diamond":
        return DiamondBadge;
      case "Gold":
        return GoldBadge;
      case "Platinum":
        return PlatinumBadge;
      case "Silver":
        return SilverBadge;
      default:
        return "";
    }
  };

  return (
    <div
      className="tooltip"
      data-tip={`${badge.badge.description} This user was awarded this badge on ${formatDate(badge.dateGiven, "MMM dd, yyyy")}.`}
    >
      <div className="flex w-fit flex-col items-center gap-2">
        <Image
          src={pickBadgeType(badge.badge.name)}
          width={size === "lg" ? 100 : 30}
          height={size === "lg" ? 100 : 30}
          alt="badge"
        />

        {size === "lg" && <p>{badge.badge.name}</p>}
      </div>
    </div>
  );
}
