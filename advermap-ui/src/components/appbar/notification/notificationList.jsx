import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchNotifications, setCount } from "../../../redux/notificationSlice";
import {
  MESSAGE_REQUEST_STATUS_FORMAT,
  ReportState,
} from "../../../constants/types";
import { stateFormat } from "../../../utils/format";
import { useNavigate } from "react-router-dom";
import { PAGE } from "components/constants";
import { setOrigin } from "redux/navSlice";
import { NotificationService } from "services/notification/notificationService";

export default function NotificationList() {
  const { count, countLoaded, notificationData } = useSelector(
    (state) => state.notification
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.appState);
  useEffect(() => {
    if (!countLoaded) {
      dispatch(fetchNotifications({ token }));
    }
  }, []);

  const handleOnClick = (message) => {
    const { latitude, longitude } = message;
    dispatch(setOrigin({ lat:latitude, lng:longitude }));
    navigate(PAGE.HOME.path,{replace:true});
    console.log(message);
  };

  
  const renderItem = () => {
    if (!notificationData || notificationData.length == 0) {
      return <></>;
    }

    return notificationData.map((data) => {
      const prima = MESSAGE_REQUEST_STATUS_FORMAT[data.type]
        ? MESSAGE_REQUEST_STATUS_FORMAT[data.type]
        : "Không xác định";
      return (
        <>
          <ListItem alignItems="flex-start">
            <ListItemText
              className="cursor-pointer"
              primary={prima}
              onClick={() => handleOnClick(data)}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {data.content}
                  </Typography>
                  {" — Nhấp để xem chi tiết trên bản đồ"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      );
    });
  };
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {renderItem()}
    </List>
  );
}
