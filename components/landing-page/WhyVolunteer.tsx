"use client";

import Link from "next/link";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

export default function WhyVolunteer() {
  return (
    <div className="bg-accent py-16 text-accent-content">
      <div className="container flex flex-row items-center justify-between gap-10">
        <div className="w-full space-y-16 lg:w-1/2">
          <div className="prose space-y-2 text-accent-content lg:prose-lg">
            <p>Benefits of Volunteering</p>
            <h1 className="text-accent-content">Why Volunteer?</h1>
          </div>
          <p>
            Volunteering provides valuable community services, so more money can
            be spent on local improvements. It is not just about the community,
            but also about the volunteer. Volunteering allows you to connect
            with your community and make it a better place.
          </p>

          <div>
            <Link
              href="https://www.youtube.com/watch?v=jbV1TDZQAFc"
              target="_blank"
            >
              <button className="btn">Find out more...</button>
            </Link>
          </div>
        </div>

        <div className="hidden h-auto w-1/2 lg:block">
          <LiteYouTubeEmbed
            aspectHeight={9}
            aspectWidth={16}
            id="jbV1TDZQAFc"
            title="{video_title}"
          />
        </div>
      </div>
    </div>
  );
}
