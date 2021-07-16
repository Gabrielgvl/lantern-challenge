import { TextField, TextFieldProps } from "@material-ui/core";
import { ChangeEventHandler, forwardRef, PropsWithoutRef } from "react";
import { useField } from "react-final-form";

export const FormTextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ name, type, inputProps, disabled, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name || "", {
      parse: type === "number" || type === "currency" ? Number : undefined,
    });

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError;

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      // Do nothing if is currency and value does not match pattern
      if (type === "currency" && !event.target.value.match(/^\d+(?:\.\d{1,2})?$/)?.length) {
        return;
      }
      input.onChange?.(event);
    };

    return (
      <TextField
        {...props}
        {...input}
        type={type === "currency" ? "number" : type}
        ref={ref}
        onChange={handleChange}
        name={name}
        disabled={disabled || submitting}
        error={!!normalizedError && touched}
        helperText={touched && normalizedError ? normalizedError : ""}
        inputProps={type === "currency" ? { ...inputProps, min: 0, step: 0.01 } : inputProps}
      />
    );
  }
);

export default FormTextField;
