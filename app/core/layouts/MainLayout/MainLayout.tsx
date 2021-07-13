import { ReactNode } from "react";
import { Head } from "blitz";

import Header from "app/core/components/Header";

type LayoutProps = {
  title?: string;
  children: ReactNode;
  authenticated?: boolean;
};

const MainLayout = ({ title, children, authenticated = true }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "lantern-wallet"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header authenticated={authenticated} />
      <main className="m-auto container grid grid-cols-1 gap-4">{children}</main>
    </>
  );
};

export default MainLayout;
