import MissionImage from "@/public/img/mission-image.svg";
import Image from "next/image";

export default function Mission() {
  return (
    <div className="container flex flex-row items-center justify-between">
      <div className="prose w-full space-y-10 lg:prose-lg md:w-1/2">
        <div className="space-y-1">
          <p>Our Mission</p>
          <h2>Empowering Communities Through Volunteering</h2>
        </div>
        <p className="text-xl">
          Bridging the gap between passionate individuals and worthy causes,
          sparking meaningful connections and fueling collaborative action
          through a seamless platform for volunteer engagement with non-profit
          organizations.
        </p>
      </div>

      <Image
        className="hidden w-1/2 md:block md:w-1/3"
        src={MissionImage}
        width={418}
        height={418}
        alt=""
      />
    </div>
  );
}
