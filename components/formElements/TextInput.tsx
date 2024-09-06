import clsx from "clsx";
import { useField } from "formik";

export default function TextInput({
  label,
  props,
  onChange,
  classes,
  required,
}: {
  label: string;
  classes?: string;
  required?: boolean;
  onChange?: (e: any) => void;
  props: {
    name: string;
    id?: string;
    type: string;
    autoComplete?: string;
    maxLength?: number;
    placeholder?: string;
  };
}) {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  const [field, meta] = useField(props.name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Call the provided onChange function if it exists
    if (onChange) {
      onChange(e);
    }
    // Call the formik's field onChange function
    field.onChange(e);
  };

  return (
    <div
      className={clsx(
        "flex gap-2",
        props.type === "checkbox"
          ? "flex-row-reverse items-center justify-end"
          : "flex-grow flex-col items-start justify-start",
      )}
    >
      <label className="space-x-2 font-medium" htmlFor={props.id || props.name}>
        <span>{label}</span>
        {required && <span className="text-error">*</span>}
      </label>
      <input
        {...field}
        {...props}
        className={clsx(
          meta.error && meta.touched
            ? "border-error focus:border-error focus:ring-error"
            : "focus:border-primary focus:ring-primary",
          props.type === "checkbox" ? "checkbox h-6 w-6" : "w-full",
          "-mb-2 bg-base-100",
          classes,
        )}
        placeholder={props.placeholder}
        onChange={handleChange}
      />

      <div className={clsx("min-h-[1.25rem] text-sm text-error")}>
        {meta.error && meta.touched ? meta.error : ""}
      </div>
    </div>
  );
}
