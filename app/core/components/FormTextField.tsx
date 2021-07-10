import { TextField, TextFieldProps } from "@material-ui/core";
import { forwardRef, PropsWithoutRef } from "react";
import { useField } from "react-final-form";

export const FormTextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ name, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name || "", {
      parse: props.type === "number" ? Number : undefined,
    });

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError;

    return (
      <TextField
        {...props}
        {...input}
        ref={ref}
        name={name}
        disabled={submitting}
        error={!!normalizedError && touched}
        helperText={touched && normalizedError ? normalizedError : ""}
      />
    );
  }
);

export default FormTextField;
