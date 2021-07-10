import { useRouter, BlitzPage } from "blitz";
import AuthLayout from "app/core/layouts/AuthLayout";
import { LoginForm } from "app/auth/components/LoginForm";

const LoginPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <LoginForm
      onSuccess={() => {
        const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/";
        router.push(next);
      }}
    />
  );
};

LoginPage.redirectAuthenticatedTo = "/";
LoginPage.getLayout = (page) => <AuthLayout title="Log In">{page}</AuthLayout>;

export default LoginPage;
