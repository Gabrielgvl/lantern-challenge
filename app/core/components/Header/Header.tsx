import classNames from "classnames";
import { FC, Suspense, useState } from "react";
import Navbar from "../Navbar";
import { Link, Routes, useMutation, useRouter, useSession } from "blitz";
import logout from "app/auth/mutations/logout";

interface HeaderProps {
  authenticated?: boolean;
}

const HeaderContent = () => {
  const session = useSession();
  const [logOut] = useMutation(logout);
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push(Routes.Home());
  };

  return (
    <>
      <h1 className="font-bold text-xl  w-auto">Lantern Wallet</h1>
      {session.userId && <Navbar />}
      {session.userId ? (
        <button onClick={handleLogout} className="bg-transparent shadow-none">
          Logout
        </button>
      ) : (
        <Link href={Routes.LoginPage()}>
          <a>Login</a>
        </Link>
      )}
    </>
  );
};

const Header: FC<HeaderProps> = ({ authenticated }) => {
  return (
    <header
      className={classNames(
        "flex sticky w-full top-0 justify-between z-50 items-center h-16 text-indigo-400 bg-gray-800 px-8 gap-8 shadow-md"
      )}
    >
      <Suspense fallback={""}>
        <HeaderContent />
      </Suspense>
    </header>
  );
};

export default Header;
