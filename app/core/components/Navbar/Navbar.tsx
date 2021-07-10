import { Link, Routes, useRouter } from "blitz";
import classNames from "classnames";
import { FC } from "react";

import styles from "./Navbar.module.css";

const links = [{ value: Routes.ShowWalletPage({ walletId: "123" }), label: "Wallet" }];

interface NavbarProps {
  className?: string;
}

const Navbar: FC<NavbarProps> = ({ className }) => {
  const query = useRouter();

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
