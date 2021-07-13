import { Link, Routes, useRouter, useSession } from "blitz";
import classNames from "classnames";
import { FC } from "react";

import styles from "./Navbar.module.css";

interface NavbarProps {
  className?: string;
}

const Navbar: FC<NavbarProps> = ({ className }) => {
  const query = useRouter();
  const session = useSession();

  const links = [
    { value: Routes.ShowWalletPage({ walletId: session.walletId || "" }), label: "Wallet" },
  ];

  return (
    <nav className={"flex flex-1 mt-0.5 gap-4 text-white items-center" + className}>
      {links.map((link) => (
        <Link key={link.label} href={link.value}>
          <a
            className={classNames(styles.navlink, {
              "--active": query.pathname === link.value.pathname,
            })}
          >
            {link.label}
          </a>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
