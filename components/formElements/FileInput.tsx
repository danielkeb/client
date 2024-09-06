import clsx from "clsx";
import { useField } from "formik";

export default function FileInput({
  label,
  required,
  onChange,
  classes,
  name,
  id,
}: {
  label: string;
  required?: boolean;
  classes?: string;
  onChange?: (e: any) => void;
  name: string;
  id?: string;
}) {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  const [field, meta] = useField(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Call the provided onChange function if it exists
    if (onChange) {
      onChange(e);
    }
    // Call the formik's field onChange function
    field.onChange(e);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="space-x-2 font-medium" htmlFor={id || name}>
        <span>{label}</span>
        {required && <span className="text-error">*</span>}
      </label>
      <input
        {...field}
        type="file"
        accept="image/*"
        className={clsx(
          meta.error && meta.touched && "file-input-error",
          "file-input file-input-bordered -mb-2 w-full max-w-xs bg-base-100",
          classes,
        )}
        onChange={handleChange}
      />

      <div className={clsx("min-h-[1.25rem] text-sm text-error")}>
        {meta.error && meta.touched ? meta.error : ""}
      </div>
    </div>
  );
}
