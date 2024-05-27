import { Input, Select } from "react-daisyui";
import { FieldError, useFormContext } from "react-hook-form";

export function Title({ label }: { label: string }) {
  return <p className="text-xl subpixel-antialiased font-bold mb-4">{label}</p>;
}

/*
 *
 *   OPTIONS SELECT
 *
 *
 */
interface optionsprops {
  options: any[];
  label: any;
  value: any;
  defaultString:string,
  error:FieldError | undefined
  title:string,
  optionalLabel?: any;
  validation?: string;
}
export function Options({
  options,
  value,
  label,
  title,
  defaultString,
  error,
  optionalLabel,
  validation,

}: optionsprops) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext(); // retrieve all hook methods
  return (
    <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
      <label className="label">
        <span className="label-text">{title}</span>
      </label>
      <Select
        {...(validation ? register(validation,
          {
            setValueAs: (value) => value === "0" || value == 0   ? undefined : Number(value)

          }
        ) : {})}
        color={error ? "error" : "neutral"}
        className="mt-1 block w-full  rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        
        <Select.Option key={0} value={0}>
            {defaultString}
          </Select.Option>
        {options.map((option, index) => (
          <Select.Option key={index} value={(option[value])}>
            {option[label]} {optionalLabel && ` - ${option[optionalLabel]}`}
          </Select.Option>
        ))}
      </Select>
      <label className="label text-error">
      {error && <span>{error.message}</span>}
      </label>
    </div>
  );
}



interface Inputprops {
  label: any;
  defaultString:string,
  error:FieldError | undefined
  title:string,
  optionalLabel?: any;
  validation?: string;
}
export function InputForm({
  label,
  title,
  defaultString,
  error,
  optionalLabel,
  validation,

}: Inputprops) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext(); // retrieve all hook methods
  return (
    <div className="flex flex-col w-full sm:w-1/3 lg:w-1/3 p-2">
      <label className="label">
        <span className="label-text">{title}</span>
      </label>
      <Input {...(validation ? register(validation,
      {
            setValueAs: (value) => value === "" ? undefined : (value)

          }) : {})} color={error ? "error" : "neutral"}/>

      <label className="label text-error">
      {error && <span>{error.message}</span>}
      </label>
    </div>
  );
}