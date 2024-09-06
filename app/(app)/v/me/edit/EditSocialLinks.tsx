"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAlertsContext } from "@/app/lib/contexts/AlertContext";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import { urlValidation } from "@/app/lib/forms/validationSchemas";
import SocialLinksInput from "@/components/formElements/SocialLinksInput";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function EditSocialLinks() {
  const { user, getUser } = useAuthContext();
  const { addAlert, dismissAlert } = useAlertsContext();
  const [initialValues, setInitialValues] = useState<any>({});
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const handleSubmit = async (updates: any) => {
    const links = Object.entries(updates).map(([platform, url]) => {
      if (url === "") url = null;

      return {
        url,
        platform,
      };
    });

    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/update`,
        {
          socialLinks: links,
        },
      );

      if (res.status === 200) {
        getUser();
      }
    } catch (error) {
      const id = addAlert({
        severity: "error",
        message: "Failed to update social links. Please try again.",
      });
      setTimeout(() => {
        dismissAlert(id);
      }, 3000);
    }
  };

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setIsUserLoaded(true);

      const reduced = user?.socialLinks?.reduce((acc: any, link: any) => {
        acc[link.platform] = link.url;
        return acc;
      }, {});

      setInitialValues(reduced);
    }
  }, [user]);

  return (
    <div className="space-y-1">
      <p>Edit Social Links</p>

      <div className="card rounded-md">
        <div className="card-body">
          {isUserLoaded && (
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                Dribbble: urlValidation,
                LinkedIn: urlValidation,
                GitHub: urlValidation,
                Behance: urlValidation,
                Instagram: urlValidation,
                Website: urlValidation,
              })}
              onSubmit={async (values) => {
                handleSubmit(values);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-2">
                  {user?.socialLinks?.map(
                    (
                      link: { platform: string; url: string },
                      index: number,
                    ) => (
                      <div key={index} className="gap-4">
                        <SocialLinksInput label={link.platform} />
                      </div>
                    ),
                  )}

                  {user?.socialLinks && (
                    <div className="mt-6 flex flex-row gap-2">
                      <button type="reset" className="btn btn-outline">
                        Cancel
                      </button>
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="btn btn-success"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}
