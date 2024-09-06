import clsx from "clsx";
import { useField } from "formik";

export default function TextAreaInput({
  label,
  required,
  props,
  classes,
}: {
  label: string;
  required?: boolean;
  classes?: string;
  props: {
    name: string;
    id?: string;
    rows?: number;
    maxLength?: number;
    placeholder?: string;
  };
}) {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  const [field, meta] = useField(props.name);

  return (
    <div className="flex flex-grow flex-col items-start justify-start gap-2">
      <label className="space-x-2 font-medium" htmlFor={props.id || props.name}>
        <span>{label}</span>
        {required && <span className="text-error">*</span>}
      </label>
      <textarea
        {...field}
        {...props}
        className={clsx(
          meta.error && meta.touched
            ? "border-error focus:border-error focus:ring-error"
            : "focus:border-primary focus:ring-primary",
          "-mb-2 w-full bg-base-100",
          classes,
        )}
        placeholder={props.placeholder}
      ></textarea>

      <div className="min-h-[1.25rem] text-sm text-error">
        {meta.error && meta.touched ? meta.error : ""}
      </div>
    </div>
  );
}
