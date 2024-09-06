"use client";

import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectList from "../../components/ProjectList";

export default function Projects() {
  const [org, setOrg] = useState<any>();
  const [inProgressProjects, setInProgressProjects] = useState<any>();
  const [finishedProjects, setFinishedProjects] = useState<any>();
  const pathname = usePathname();

  // Fetch projects on page load
  useEffect(() => {
    const fetchInProgressProjects = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/in-progress/${org.id}`,
        );

        if (res.status === 200) {
          setInProgressProjects(res.data);
        }
      } catch (error) {}
    };

    const fetchFinishedProjects = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/finished/${org.id}`,
        );

        if (res.status === 200) {
          setFinishedProjects(res.data);
        }
      } catch (error) {}
    };

    fetchInProgressProjects();
    fetchFinishedProjects();
  }, [org]);

  useEffect(() => {
    const gerOrg = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/organizations/${pathname.split("/")[2]}`,
        );

        if (res.status === 200) {
          setOrg(res.data);
        }
      } catch (error) {
        setOrg(null);
      }
    };

    gerOrg();
  }, [pathname]);

  return (
    <>
      <div>
        <h3 className="mb-6 text-2xl">Projects</h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <h3>In Progress Projects</h3>
            <div className="divider"></div>
            {inProgressProjects && inProgressProjects.length > 0 ? (
              <ProjectList
                projects={inProgressProjects}
                isDone={false}
                own={false}
              />
            ) : (
              <p className="py-4 text-center italic">No projects in progress</p>
            )}
          </div>

          <div className="space-y-1">
            <h3>Finished Projects</h3>
            <div className="divider"></div>
            {finishedProjects && finishedProjects.length > 0 ? (
              <ProjectList projects={finishedProjects} isDone own={false} />
            ) : (
              <p className="py-4 text-center italic">No projects finished</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
