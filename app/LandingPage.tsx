import Footer from "@/components/global/Footer";
import Header from "@/components/landing-page/Header";
import Hero from "@/components/landing-page/Hero";
import LatestProjects from "@/components/landing-page/LatestProjects";
import Mission from "@/components/landing-page/Mission";
import Stats from "@/components/landing-page/Stats";
import WhyVolunteer from "@/components/landing-page/WhyVolunteer";
import Link from "next/link";
import { GiStumpRegrowth } from "react-icons/gi";
import { LuBadgeCheck } from "react-icons/lu";
import { RiSmartphoneLine } from "react-icons/ri";
import { VscMerge } from "react-icons/vsc";

export default function LandingPage() {
  return (
    <div className="max-w-screen overflow-hidden">
      <Header />

      <Hero />

      <div className="space-y-32 md:space-y-40 xl:space-y-48">
        <Stats />

        <Mission />

        <LatestProjects />

        <section className="w-full">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:gap-12">
              <div className="mx-auto space-y-4 text-center">
                <div className="inline-block rounded-lg py-1 text-sm">
                  Our Story
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Aiming to be the go-to resource for volunteering activities
                </h2>
                <p className="mx-auto text-center text-neutral md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We are a fifth year software engineering students. They reason
                  we want to build this system is to address the challenges
                  faced by volunteer organizations and individuals seeking
                  meaningful opportunities. The motivation behind this project
                  is to facilitate connections between passionate volunteers and
                  organizations needing their help, ultimately fostering
                  community engagement and social impact through technology. By
                  leveraging our software engineering expertise and insights
                  from Ethiopian society, we aim to develop an intuitive
                  platform that empowers individuals to contribute effectively
                  to their communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="container px-4 md:px-6">
            <div className="space-y-4 text-center">
              <div className="inline-block rounded-lg px-3 py-1 text-sm">
                Our Values
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Guiding Principles for Success
              </h2>
              <p className="mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our core values shape our culture and guide our actions,
                ensuring we remain focused on empowering professionals and
                fostering a thriving community.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-4">
                <VscMerge size={48} />
                <h3 className="text-lg font-semibold">Collaboration</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  We believe in the power of teamwork and collective effort to
                  achieve greater success.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <GiStumpRegrowth size={48} />
                <h3 className="text-lg font-semibold">Growth</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  We are committed to continuous learning and personal
                  development, empowering our members to reach their full
                  potential.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <LuBadgeCheck size={48} />
                <h3 className="text-lg font-semibold">Integrity</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  We uphold the highest standards of ethics and transparency in
                  all our interactions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <RiSmartphoneLine size={48} />
                <h3 className="text-lg font-semibold">Innovation</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  We embrace new ideas and technologies to continuously improve
                  our platform and services.
                </p>
              </div>
            </div>
          </div>
        </section>

        <WhyVolunteer />

        {/* Join us section */}
        <div className="container prose min-w-full text-center lg:prose-lg">
          <h1>Ready to make a difference?</h1>
          <p className="mb-8">
            Get involved today and help us build a better community.
          </p>
          <Link href="/sign-up">
            <button className="btn btn-primary">Join Us</button>
          </Link>
        </div>

        <Footer />
      </div>
    </div>
  );
}
