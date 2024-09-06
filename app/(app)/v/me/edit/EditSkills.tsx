"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import { TextInput } from "@/components/formElements";
import axios from "axios";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import { useDebouncedCallback } from "use-debounce";

export default function EditSkills() {
  const { user, getUser } = useAuthContext();
  const { addAlert, dismissAlert } = useAlertsContext();
  const [skills, setSkills] = useState<any>();
  const [searchQuery, setSearchQuery] = useState("");

  // Update the search query after 300ms of inactivity in the search input
  const handleChange = useDebouncedCallback((e: any) => {
    setSearchQuery(e && e.target.value);
  }, 300);

  // Update the user skill set when the user clicks on an option
  const handleSelect = async (skillId: string) => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/update`,
        {
          skills: [skillId],
        },
      );

      if (res.status === 200) {
        getUser();
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to add skill. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  // Remove the user skill set when the user clicks on the X mark
  const handleRemove = async (skillId: string) => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/skills/remove/${skillId}`,
      );

      if (res.status === 200) {
        getUser();
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to remove skill. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  // Get the list of skills when the searchQuery changes
  useEffect(() => {
    const getSkills = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/skills/search/${searchQuery}`,
        );

        if (res.status === 200) {
          setSkills(res.data);
        }
      } catch (error) {
        const id = addAlert({
          severity: "error",
          message: "Failed to retrieve list of skills. Please try again.",
        });
        setTimeout(() => {
          dismissAlert(id);
        }, 3000);
      }
    };

    if (searchQuery.length > 0) {
      getSkills();
    } else {
      setSkills(null);
    }
  }, [addAlert, dismissAlert, searchQuery]);

  return (
    <div className="space-y-1">
      <p>Skills</p>

      <div className="card rounded-md">
        <div className="card-body">
          {/* Display the user's skills */}
          {user?.skills?.length > 0 ? (
            user.skills.map(
              (
                skill: {
                  id: string;
                  name: string;
                  description: string;
                  category: any;
                },
                index: number,
              ) => (
                <div
                  key={skill.id}
                  className="flex flex-row items-center gap-8 space-y-1"
                >
                  <div
                    key={skill.name}
                    className={clsx(
                      "space-y-1 py-2",
                      index === 0 && "pt-0",
                      index === user.skills.length - 1 && "pb-0",
                    )}
                  >
                    <div>
                      <span className="personal-info-value">{skill.name}</span>
                      <div className="badge badge-primary mx-3">
                        {skill.category.name}
                      </div>
                    </div>
                    <p className="text-text-200 line-clamp-1 font-light">
                      {skill.description}
                    </p>
                  </div>

                  <div
                    className="cursor-pointer"
                    onClick={() => handleRemove(skill.id)}
                  >
                    <BiX size={24} />
                  </div>
                </div>
              ),
            )
          ) : (
            <div>No skills added yet</div>
          )}

          {/* Display a form to add a new skill */}
          <div className="pt-10">
            <Formik
              initialValues={{
                skills: "",
              }}
              onSubmit={() => {}}
            >
              <Form>
                <TextInput
                  label="Add Skill"
                  props={{
                    name: "add skill",
                    type: "search",
                    autoComplete: undefined,
                    placeholder: "Search for skills...",
                  }}
                  onChange={handleChange}
                />
                <ul className="max-h-56 space-y-2 overflow-y-scroll p-2 shadow-xl">
                  {skills && skills.length > 0
                    ? skills.map((skill: any, index: number) => (
                        <li
                          key={index}
                          className={clsx(
                            "cursor-pointer rounded px-3 py-4 hover:bg-neutral/50 hover:text-neutral-content",
                            index === 0 && "pt-0",
                            index === skills.length - 1 && "pb-0",
                          )}
                          onClick={() => handleSelect(skill.id)}
                        >
                          <div>
                            <span className="personal-info-value">
                              {skill.name}
                            </span>
                            <div className="badge badge-primary mx-2">
                              {skill.category.name}
                            </div>
                          </div>
                          <p className="line-clamp-2 font-light">
                            {skill.description}
                          </p>
                        </li>
                      ))
                    : searchQuery && <div className="p-2">No skills found</div>}
                </ul>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
