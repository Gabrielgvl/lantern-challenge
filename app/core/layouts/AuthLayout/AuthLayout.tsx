import { ReactNode } from "react";
import { Head } from "blitz";

type LayoutProps = {
  title?: string;
  children: ReactNode;
  authenticated?: boolean;
};

const AuthLayout = ({ title, children, authenticated }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "lantern-wallet"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gradient-to-tr from-indigo-900 to-gray-900 h-full flex items-center justify-center text-white w-full">
        {children}
      </main>
    </>
  );
};

export default AuthLayout;
