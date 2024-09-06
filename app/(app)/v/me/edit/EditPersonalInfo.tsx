"use client";

import axiosInstance from "@/app/axiosInstance";
import { useAuthContext } from "@/app/lib/contexts/AppContext";
import {
  ageValidation,
  bioTextValidation,
  emailValidation,
  firstNameValidation,
  genderValidation,
  lastNameValidation,
  locationValidation,
  usernameValidation,
} from "@/app/lib/forms/validationSchemas";
import { SelectInput, TextInput } from "@/components/formElements";
import TextAreaInput from "@/components/formElements/TextAreaInput";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

type Texts = {
  [key: string]: any;
};

export default function EditPersonalInfo({
  locations,
}: {
  locations: object[];
}) {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [initialValues, setInitialValues] = useState<Texts>({});
  const { user, getUser } = useAuthContext();

  const handleSubmit = async (updates: any) => {
    let changes: Texts = {};

    for (const key in updates) {
      if (initialValues[key] !== updates[key]) {
        changes[key] = updates[key];
      }
    }

    if (Object.keys(changes).length === 0) {
      return;
    }

    const res = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me/update`,
      { ...changes },
    );

    if (res.status === 200) {
      getUser();
    }
  };

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setIsUserLoaded(true);
      setInitialValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        username: user.username || "",
        gender: user.gender || "",
        age: user.age || 0,
        email: user.email || "",
        locationId: user?.location?.id || "",
      });
    }
  }, [user]);

  return (
    <div className="space-y-1">
      <p>Personal Info</p>

      <div className="card rounded-md">
        <div className="card-body">
          {isUserLoaded && (
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                firstName: firstNameValidation,
                lastName: lastNameValidation,
                bio: bioTextValidation,
                username: usernameValidation,
                gender: genderValidation,
                age: ageValidation,
                email: emailValidation,
                locationId: locationValidation,
              })}
              onSubmit={async (values) => {
                handleSubmit(values);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-2">
                  <div className="flex flex-col gap-4 lg:flex-grow xl:flex-row">
                    <TextInput
                      label="First Name"
                      props={{
                        name: "firstName",
                        type: "text",
                        autoComplete: "off",
                      }}
                    />

                    <TextInput
                      label="Last Name"
                      props={{
                        name: "lastName",
                        type: "text",
                        autoComplete: "off",
                      }}
                    />
                  </div>

                  <TextAreaInput
                    label="Bio"
                    props={{
                      name: "bio",
                      id: "bio",
                      rows: 5,
                    }}
                  />

                  <div className="lg:w-1/2 lg:pr-2">
                    <TextInput
                      label="Username"
                      props={{
                        name: "username",
                        id: "username",
                        type: "text",
                      }}
                    />
                  </div>

                  <div className="flex flex-row gap-4 lg:w-1/2 lg:pr-2">
                    <div className="w-1/2">
                      <SelectInput
                        label="Gender"
                        props={{
                          name: "gender",
                          id: "gender",
                        }}
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </SelectInput>
                    </div>

                    <div className="w-1/2">
                      <TextInput
                        label="Age"
                        classes="w-1/2"
                        props={{
                          name: "age",
                          id: "age",
                          type: "number",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-grow gap-4 xl:flex-row">
                    <div className="w-1/2">
                      <TextInput
                        label="Email"
                        props={{
                          name: "email",
                          type: "email",
                          autoComplete: "off",
                        }}
                      />
                    </div>

                    <div className="w-1/2">
                      <SelectInput
                        label="Location"
                        props={{
                          name: "locationId",
                        }}
                      >
                        <option>--Select your location--</option>
                        {locations?.map((location: any) => {
                          return (
                            <option key={location.id} value={location.id}>
                              {location.name}
                            </option>
                          );
                        })}
                      </SelectInput>
                    </div>
                  </div>

                  <div className="flex flex-row gap-4">
                    <button type="reset" className="btn btn-outline">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-success"
                    >
                      Save Changes
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}
