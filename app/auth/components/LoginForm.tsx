import { AuthenticationError, Link, useMutation, Routes } from "blitz";
import { FormTextField } from "app/core/components/FormTextField";
import { Form, FORM_ERROR } from "app/core/components/Form";
import login from "app/auth/mutations/login";
import { Login } from "app/auth/validations";
import FormCard from "app/auth/components/FormCard";

type LoginFormProps = {
  onSuccess?: () => void;
};

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login);

  return (
    <FormCard title={"Login"}>
      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          console.debug({ values });
          try {
            await loginMutation(values);
            props.onSuccess?.();
          } catch (error) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" };
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              };
            }
          }
        }}
      >
        <FormTextField name="email" label="Email" placeholder="Email" />
        <FormTextField name="password" label="Password" placeholder="Password" type="password" />
      </Form>
      <span className="mt-4">
        Or{" "}
        <Link href={Routes.SignupPage()}>
          <a className="border-indigo-300 border-b text">Sign Up</a>
        </Link>
      </span>
    </FormCard>
  );
};

export default LoginForm;
