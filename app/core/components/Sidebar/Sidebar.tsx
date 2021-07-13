import { Routes, Link, useSession } from "blitz";
import { FC, useState } from "react";

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import MenuIcon from "@material-ui/icons/Menu";

interface NavbarProps {
  className?: string;
}

const Navbar: FC<NavbarProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const session = useSession();

  const links = [
    {
      value: Routes.ShowWalletPage({ walletId: session.walletId || "" }),
      label: "Wallet",
      Icon: AccountBalanceWalletIcon,
    },
  ];

  const toggleDrawer = (open: boolean) => (event) => {
    if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setOpen(open);
  };

  return (
    <>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <List>
          {links.map((link) => (
            <Link href={link.value} key={link.value.pathname}>
              <ListItem button>
                <ListItemIcon>{<link.Icon />}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            </Link>
          ))}
        </List>
      </SwipeableDrawer>
    </>
  );
};

export default Navbar;
