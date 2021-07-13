import { Routes, useMutation, Link } from "blitz";
import { FormTextField } from "app/core/components/FormTextField";
import { Form, FORM_ERROR } from "app/core/components/Form";
import signup from "app/auth/mutations/signup";
import { Signup } from "app/auth/validations";
import FormCard from "app/auth/components/FormCard";
import CurrencySelect from "app/core/components/CurrencySelect";
import { Suspense } from "react";

type SignupFormProps = {
  onSuccess?: () => void;
};

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup);

  return (
    <FormCard title="Create an Account">
      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values);
            props.onSuccess?.();
          } catch (error) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" };
            } else {
              return { [FORM_ERROR]: error.toString() };
            }
          }
        }}
      >
        <FormTextField name="email" label="Email" placeholder="Email" type="email" />
        <FormTextField name="password" label="Password" placeholder="Password" type="password" />
        <CurrencySelect name="defaultCurrency" />
      </Form>
      <span className="mt-4">
        Or{" "}
        <Link href={Routes.LoginPage()}>
          <a className="border-indigo-300 border-b text">Log In</a>
        </Link>
      </span>
    </FormCard>
  );
};

export default SignupForm;
