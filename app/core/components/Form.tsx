import { ReactNode, PropsWithoutRef } from "react";
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form";
import { z } from "zod";
import { validateZodSchema } from "blitz";
import { Button } from "@material-ui/core";
import classNames, { Argument } from "classnames";
export { FORM_ERROR } from "final-form";

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit" | "className"> {
  /** All your form fields */
  children?: ReactNode;
  /** Text to display in the submit button */
  submitText?: string;
  schema?: S;
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"];
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"];
  className?: Argument;
}

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  className,
  ...props
}: FormProps<S>) {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, submitError }) => (
        <form
          onSubmit={handleSubmit}
          className={classNames("gap-4 flex flex-col w-full", className)}
          {...props}
        >
          {children}

          {submitError && (
            <p role="alert" style={{ color: "red" }}>
              {submitError}
            </p>
          )}

          {submitText && (
            <Button variant="contained" type="submit" disabled={submitting}>
              {submitText}
            </Button>
          )}
        </form>
      )}
    />
  );
}

export default Form;
