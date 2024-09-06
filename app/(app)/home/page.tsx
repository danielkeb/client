"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import "@/app/styles.css";
import { SelectInput } from "@/components/formElements";
import axios from "axios";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Suspense, useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import ProjectList from "./components/ProjectList";

function Home() {
  const { user } = useAuthContext();
  const [projects, setProjects] = useState<any>();
  const [recommendedProjects, setRecommendedProjects] = useState<any>();
  const [sortedProjects, setSortedProjects] = useState<any>();
  const [updatedProjects, setUpdatedProjects] = useState<any>();
  const [range, setRange] = useState([0, 10]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<
    "title" | "org" | "location" | "startDate" | "endDate" | "openPositions"
  >("startDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      router.replace(`/home?${params.toString()}`);
    },
    [router, searchParams],
  );

  const timePreferenceOptions = [
    {
      id: "time-preference-both",
      value: "BOTH",
      label: "Both",
    },
    {
      id: "time-preference-short",
      value: "SHORT_TERM",
      label: "Short Term",
    },
    {
      id: "time-preference-long",
      value: "LONG_TERM",
      label: "Long Term",
    },
  ];

  const projectStatusOptions = [
    {
      id: "project-status-all",
      value: "ALL",
      label: "All",
    },
    {
      id: "project-status-not-started",
      value: "NOT_STARTED",
      label: "Not Started",
    },
    {
      id: "project-status-in-progress",
      value: "IN_PROGRESS",
      label: "In Progress",
    },
    {
      id: "project-status-done",
      value: "DONE",
      label: "Done",
    },
  ];

  const locationOptions = [
    {
      id: "location-all",
      value: "ALL",
      label: "All",
    },
    {
      id: "location-my",
      value: "MY_LOCATION",
      label: "My Location",
    },
    {
      id: "location-remote",
      value: "REMOTE",
      label: "Remote",
    },
  ];

  const goBack = () => {
    if (range[0] > 0) {
      setRange([range[0] - 10, range[1] - 10]);
    }
  };

  const goForward = () => {
    if (range[1] - 10 < projects.length) {
      setRange([range[0] + 10, range[1] + 10]);
    }
  };

  const handleLocationFilterChange = (newValue: string) => {
    createQueryString("location", newValue);
  };

  const handleTimeFilterChange = (newValue: string) => {
    createQueryString("time", newValue);
  };

  const handleProjectStatusChange = (newValue: string) => {
    createQueryString("status", newValue);
  };

  const handleQueryChange = useDebouncedCallback((newValue: string) => {
    createQueryString("query", newValue);
  }, 300);

  useEffect(() => {
    const buildParams = () => {
      const params: any = {};

      // Status
      if (searchParams.has("status") && searchParams.get("status") !== "ALL") {
        params.status = searchParams.get("status");
      }

      // Location
      if (
        searchParams.has("location") &&
        searchParams.get("location") !== "ALL"
      ) {
        const location = searchParams.get("location");
        if (location === "MY_LOCATION") {
          params.location = user.locationId;
        }
        params.location = location;
      }

      // Time
      if (searchParams.has("time") && searchParams.get("time") !== "BOTH") {
        params.time = searchParams.get("time");
      }

      // Query
      if (searchParams.has("query")) {
        params.query = searchParams.get("query");
      }

      return params;
    };

    const fetchFilteredProjects = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/projects`,
          {
            params: buildParams(),
          },
        );

        if (res.status === 200) {
          setProjects(res.data);
          setSortedProjects(res.data);
        }
      } catch (error) {}
    };

    const fetchRecommendedProjects = async () => {
      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/recommendations`,
        );

        if (res.status === 200) {
          setRecommendedProjects(res.data);
        }
      } catch (error) {}
    };

    fetchFilteredProjects();
    fetchRecommendedProjects();
  }, [searchParams, user]);

  useEffect(() => {
    if (projects) {
      switch (sortBy) {
        case "title":
          const sortedByTitle = projects.sort((a: any, b: any) => {
            return sortOrder === "asc"
              ? b.title.localeCompare(a.title, { sensitivity: "base" })
              : a.title.localeCompare(b.title, { sensitivity: "base" });
          });
          setSortedProjects(sortedByTitle);
          break;

        case "org":
          const sortedByOrg = projects.sort((a: any, b: any) => {
            return sortOrder === "asc"
              ? b.organization.name.localeCompare(a.organization.name, {
                  sensitivity: "base",
                })
              : a.organization.name.localeCompare(b.organization.name, {
                  sensitivity: "base",
                });
          });
          setSortedProjects(sortedByOrg);
          break;

        case "location":
          const sortedByLocation = projects.sort((a: any, b: any) => {
            return sortOrder === "asc"
              ? b.location.name.localeCompare(a.location.name, {
                  sensitivity: "base",
                })
              : a.location.name.localeCompare(b.location.name, {
                  sensitivity: "base",
                });
          });
          setSortedProjects(sortedByLocation);
          break;

        case "startDate":
          const sortedByStartDate = projects.sort((a: any, b: any) => {
            return sortOrder === "asc"
              ? b.startDate.localeCompare(a.startDate, {
                  sensitivity: "base",
                })
              : a.startDate.localeCompare(b.startDate, {
                  sensitivity: "base",
                });
          });
          setSortedProjects(sortedByStartDate);
          break;

        case "endDate":
          const sortedByEndDate = projects.sort((a: any, b: any) => {
            return sortOrder === "asc"
              ? b.endDate.localeCompare(a.endDate, {
                  sensitivity: "base",
                })
              : a.endDate.localeCompare(b.endDate, { sensitivity: "base" });
          });
          setSortedProjects(sortedByEndDate);

        case "openPositions":
          const sortedByOpenPositions = projects.sort((a: any, b: any) => {
            const calculateOpenPositions = (skillsRequired: any) => {
              let initialValue = 0;

              let sum = skillsRequired.reduce(
                (totalValue: any, currentSkill: any) => {
                  return totalValue + currentSkill.vacancies;
                },
                initialValue,
              );

              return sum;
            };

            const openPositionsA = calculateOpenPositions(a.skillsRequired);
            const openPositionsB = calculateOpenPositions(b.skillsRequired);

            return sortOrder === "asc"
              ? openPositionsB - openPositionsA
              : openPositionsA - openPositionsB;
          });
          setSortedProjects(sortedByOpenPositions);
          break;

        default:
          setSortedProjects(projects);
      }

      if (recommendedProjects) {
        // Create a set of recommended project IDs for quick lookup
        const recommendedProjectIds = recommendedProjects.map(
          (project: any) => project.project.id,
        );

        // Iterate through all projects and mark them as recommended if they are in the recommended list
        const withRecommendedFlag = sortedProjects.map((project: any) => ({
          ...project,
          recommended: recommendedProjectIds.includes(project.id),
        }));
        setUpdatedProjects(withRecommendedFlag);
      }
    }
  }, [projects, recommendedProjects, sortBy, sortOrder, sortedProjects]);

  return (
    <div className="layout-container">
      <div className="layout-left-child">
        {/* Filter options sidebar */}
        <div className="card rounded-md">
          <div className="card-body space-y-3">
            <span className="text-lg font-semibold">Filter Options</span>

            <div>
              <div>
                <span>Location</span>
                <div className="divider my-0"></div>
              </div>

              <div
                className="flex flex-col"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleLocationFilterChange(e && e.target.value);
                }}
              >
                {locationOptions.map((option, index) => (
                  <label
                    key={index}
                    className="label cursor-pointer items-center justify-start gap-2 px-3 py-0.5"
                  >
                    <input
                      type="radio"
                      name="location"
                      id={option.id}
                      value={option.value}
                      defaultChecked={
                        searchParams.get("location") === option.value
                      }
                    />
                    <span className="">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div>
                <span>Time Preference</span>
                <div className="divider my-0"></div>
              </div>

              <div
                className="flex flex-col"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleTimeFilterChange(e && e.target.value);
                }}
              >
                {timePreferenceOptions.map((option, index) => (
                  <label
                    key={index}
                    className="label cursor-pointer items-center justify-start gap-2 px-3 py-0.5"
                  >
                    <input
                      type="radio"
                      name="time-preference"
                      id={option.id}
                      value={option.value}
                      defaultChecked={searchParams.get("time") === option.value}
                    />
                    <span className="">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div>
                <span>Project Status</span>
                <div className="divider my-0"></div>
              </div>

              <div
                className="flex flex-col"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleProjectStatusChange(e && e.target.value);
                }}
              >
                {projectStatusOptions.map((option, index) => (
                  <label
                    key={index}
                    className="label cursor-pointer items-center justify-start gap-2 px-3 py-0.5"
                  >
                    <input
                      type="radio"
                      name="project-status"
                      id={option.id}
                      value={option.value}
                      defaultChecked={
                        searchParams.get("status") === option.value
                      }
                    />
                    <span className="">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sort options sidebar */}
        <div className="card rounded-md">
          <div className="card-body space-y-3">
            <span className="text-lg font-semibold">Sort Options</span>

            <Formik
              initialValues={{
                sortBy: sortBy,
                sortOrder: sortOrder,
              }}
              onSubmit={() => {}}
            >
              <Form>
                <div className="flex flex-row items-center gap-2">
                  <SelectInput
                    classes="flex-grow"
                    label="Sort By"
                    props={{
                      name: "sortBy",
                    }}
                    handleChange={(e: any) => setSortBy(e.target.value)}
                  >
                    <option value="title">Title</option>
                    <option value="org">Organization name</option>
                    <option value="location">Location</option>
                    <option value="startDate">Start date</option>
                    <option value="endDate">End date</option>
                    <option value="openPositions">
                      Number of open positions
                    </option>
                  </SelectInput>
                  <SelectInput
                    classes="flex-shrink"
                    label="Sort Order"
                    props={{
                      name: "sortOrder",
                    }}
                    handleChange={(e: any) => setSortOrder(e.target.value)}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </SelectInput>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      {/* Main page - projects list */}
      <div className="layout-right-child text-center">
        <input
          type="text"
          placeholder="Search by project title, description or organization name"
          className="input input-bordered w-full"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleQueryChange(e && e.target.value);
          }}
        />

        <div className="divider"></div>

        <>
          {updatedProjects && updatedProjects.length > 0 ? (
            <>
              <div className="text-left">
                <ProjectList
                  projects={updatedProjects.slice(range[0], range[1])}
                />
              </div>

              <div className="divider"></div>

              <div className="join flex items-center justify-between">
                <button
                  className="btn btn-outline btn-primary join-item"
                  onClick={goBack}
                >
                  Previous
                </button>

                <button
                  className="btn btn-outline btn-primary join-item"
                  onClick={goForward}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="my-10 italic">
              <span>
                No projects matching your criteria. Try changing your filters or
                search using different keyword.
              </span>
            </div>
          )}
        </>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
