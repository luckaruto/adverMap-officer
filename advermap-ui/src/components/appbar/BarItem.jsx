import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { setCurrentPage } from "redux/appSlice";

BarItem.propTypes = {
  data: PropTypes.object.isRequired,
};
export default function BarItem({ data }) {
  const { page, icon, open } = data;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleOnClick = () => {
    dispatch(setCurrentPage(page));
    navigate(page.path);
  };

  return (
    <ListItem key={page?.path} disablePadding sx={{ display: "block" }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
        onClick={handleOnClick}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          <>{icon}</>
        </ListItemIcon>
        <ListItemText
          className="text-black"
          primary={page?.name}
          sx={{ opacity: open ? 1 : 0, color: "black" }}
        />
      </ListItemButton>
    </ListItem>
  );
}
