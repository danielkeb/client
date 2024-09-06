"use client";

import "swiper/css";
import {
  Autoplay,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/keyboard";
import "swiper/css/mousewheel";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LogoAvatar from "../global/LogoAvatar";

export default function LatestProjects() {
  const [latestProjects, setLatestProjects] = useState<any>();
  const breakpoints = {
    0: {
      slidesPerView: 1,
    },
    480: {
      slidesPerView: 2,
    },
    1280: {
      slidesPerView: 3,
    },
  };

  // Fetch latest projects on page load
  useEffect(() => {
    const fetchLatestProjects = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/latest`,
        );

        if (res.status === 200) {
          setLatestProjects(res.data);
        }
      } catch (error) {}
    };

    fetchLatestProjects();
  }, []);

  return (
    <div className="container space-y-16">
      <h3 className="text-4xl font-semibold">Latest Projects</h3>

      <Swiper
        modules={[Autoplay, Keyboard, Mousewheel, Navigation, Pagination]}
        spaceBetween={24}
        mousewheel
        breakpoints={breakpoints}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        autoplay={{
          disableOnInteraction: false,
        }}
        keyboard={{
          enabled: true,
        }}
      >
        {latestProjects &&
          latestProjects.map((project: any) => {
            return (
              <SwiperSlide
                key={project.id}
                className="mb-20 space-y-6 rounded-md bg-accent p-8 text-accent-content shadow-md"
              >
                <div className="flex flex-row items-center gap-6">
                  <LogoAvatar id={project.id} name={project.name} size="base" />

                  <div>
                    <p className="line-clamp-1 text-2xl font-medium">
                      {project.title}
                    </p>
                    <div className="line-clamp-1 text-sm">
                      {project.locationId === null ? (
                        "Remote"
                      ) : (
                        <span>{project.location.name}</span>
                      )}
                      <span className="mx-2 border-r"></span>
                      <span>{project.organization.name}</span>
                    </div>
                  </div>
                </div>

                <p className="line-clamp-4">{project.description}</p>

                <div className="flex justify-between text-sm">
                  <div>{`${format(project.startDate, "MMMM yyyy")} -- ${format(project.endDate, "MMMM yyyy")}`}</div>
                  <div>{project.numberOfVolunteers} volunteers</div>
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
}
