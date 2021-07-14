import { FC, memo, useState, MouseEventHandler } from "react";

import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { Routes, useMutation, useRouter } from "blitz";
import logout from "app/auth/mutations/logout";

import { AccountCircleOutlined } from "@material-ui/icons";

const UserMenu: FC = () => {
  const [logOut] = useMutation(logout);
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    await logOut();
    router.push(Routes.Home());
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <AccountCircleOutlined />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default memo(UserMenu);
