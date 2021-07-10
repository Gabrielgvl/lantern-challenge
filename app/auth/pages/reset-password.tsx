import { BlitzPage, useRouterQuery, Link, useMutation, Routes } from "blitz";
import Layout from "app/core/layouts/MainLayout";
import { FormTextField } from "app/core/components/FormTextField";
import { Form, FORM_ERROR } from "app/core/components/Form";
import { ResetPassword } from "app/auth/validations";
import resetPassword from "app/auth/mutations/resetPassword";

const ResetPasswordPage: BlitzPage = () => {
  const query = useRouterQuery();
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword);

  return (
    <div>
      <h1>Set a New Password</h1>

      {isSuccess ? (
        <div>
          <h2>Password Reset Successfully</h2>
          <p>
            Go to the <Link href={Routes.Home()}>homepage</Link>
          </p>
        </div>
      ) : (
        <Form
          submitText="Reset Password"
          schema={ResetPassword}
          initialValues={{ password: "", passwordConfirmation: "", token: query.token as string }}
          onSubmit={async (values) => {
            try {
              await resetPasswordMutation(values);
            } catch (error) {
              if (error.name === "ResetPasswordError") {
                return {
                  [FORM_ERROR]: error.message,
                };
              } else {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                };
              }
            }
          }}
        >
          <FormTextField name="password" label="New Password" type="password" />
          <FormTextField name="passwordConfirmation" label="Confirm New Password" type="password" />
        </Form>
      )}
    </div>
  );
};

ResetPasswordPage.redirectAuthenticatedTo = "/";
ResetPasswordPage.getLayout = (page) => <Layout title="Reset Your Password">{page}</Layout>;

export default ResetPasswordPage;
