import "./Input.css";
import { ErrorMessage } from "@hookform/error-message";
import { FieldName, FieldValues } from "react-hook-form";

interface InputProps {
  labelText: string;
  register: any;
  type?: string;
  value?: string | number;
  errors?: any;
  name?: FieldName<FieldValues>;
}

const InputComponent = ({
  labelText,
  type = "string",
  value,
  register,
  errors,
  name,
}: InputProps) => {
  return (
    <div className="input-div">
      <label>{labelText}</label>
      <input
        {...register}
        type={type}
        defaultValue={value}
        placeholder={labelText}
      />
      {errors && <ErrorMessage errors={errors} name={name as string} as="p" />}
    </div>
  );
};

export default InputComponent;
