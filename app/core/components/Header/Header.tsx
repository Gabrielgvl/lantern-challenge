import classNames from "classnames";
import { FC, Suspense } from "react";
import { Link, Routes, useSession } from "blitz";
import UserMenu from "./UserMenu";
import Sidebar from "../Sidebar";
import { Button } from "@material-ui/core";

const HeaderContent = () => {
  const session = useSession();

  return (
    <>
      {session.userId && <Sidebar />}
      <h1 className={classNames("font-bold text-xl sm:flex-1 w-auto", { "ml-8": !session.userId })}>
        Lantern Wallet
      </h1>
      {session.userId ? (
        <UserMenu />
      ) : (
        <Link href={Routes.LoginPage()}>
          <Button className="mr-8" variant="contained">
            Login
          </Button>
        </Link>
      )}
    </>
  );
};

const Header: FC = () => {
  return (
    <header
      className={classNames(
        "flex sticky w-full top-0 justify-between z-50 items-center h-16 text-indigo-400 bg-gray-800 px-2 gap-8 shadow-md"
      )}
    >
      <Suspense fallback={""}>
        <HeaderContent />
      </Suspense>
    </header>
  );
};

export default Header;
