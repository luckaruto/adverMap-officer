import {
  RequestState,
  SpaceFormat,
  SpaceType,
  SurfaceFormat, UserRole, UserRoleName,
} from "constants/types";
import React from "react";

export const plannedFormat = (value) => {
  switch (value) {
    case true:
      return "Đã Quy Hoạch";
      break;
    case false:
      return "Chưa Quy Hoạch";
      break;
  }
};

export const typeFormat = (value) => {
  switch (value) {
    case SpaceType.PUBLIC_LAND:
      return "Công cộng";
    case SpaceType.PARK:
      return "Công viên";
    case SpaceType.TRAFFIC_CORRIDOR:
      return "Đường giao thông";
    case SpaceType.PRIVATE_LAND:
      return "Đất riêng";
    case SpaceType.SHOPPING_CENTER:
      return "Trung tâm mua sắm";
    case SpaceType.MARKET:
      return "Chợ";
    case SpaceType.GAS_STATION:
      return "Trạm xăng";
    case SpaceType.BUS_SHELTER:
      return "Trạm dừng xe bus";
    default:
      return "Cá Nhân";
  }
};
export const formatFormat = (value) => {
  switch (value) {
    case SpaceFormat.POLITICAL_MOBILIZATION:
      return "Mobilization quốc gia";
    case SpaceFormat.COMMERCIAL_ADS:
      return "Quảng cáo thương mại";
    case SpaceFormat.SOCIALIZATION:
      return "Tổ chức xã hội";
    case SurfaceFormat.HIFLEX_POST:
      return "Biển quảng cáo Hiflex";
    case SurfaceFormat.LED_SCREEN:
      return "Màn hình LED";
    case SurfaceFormat.LIGHT_BOX:
      return "Hộp đèn";
    case SurfaceFormat.HIFLEX_WALL:
      return "Biển quảng cáo Hiflex trên tường";
    case SurfaceFormat.WALL_MOUNTED_LED_SCREEN:
      return "Màn hình LED treo tường";
    case SurfaceFormat.VERTICAL_BANNER:
      return "Banner đứng";
    case SurfaceFormat.HORIZONTAL_BANNER:
      return "Banner nằm";
    case SurfaceFormat.PANEL:
      return "Bảng hiển thị";
    case SurfaceFormat.WELCOME_GATE:
      return "Cổng chào";
    case SurfaceFormat.SHOPPING_CENTER:
      return "Khu mua sắm";
    default:
      return "Chưa xác định";
  }
};

export const stateFormat = (value) => {
  switch (value) {
    case RequestState.IN_PROGRESS:
      return "Đang xử lý";
    case RequestState.REJECTED:
      return "Từ chối";
    case RequestState.CANCELED:
      return "Đã hủy";
    case RequestState.APPROVED:
      return "Đã duyệt";
    default:
      return "Không xác định";
  }
};

export function formatDateTime(isoTimestamp) {
  const dateTime = new Date(isoTimestamp);

  const day = dateTime.getDate();
  const month = dateTime.toLocaleString("vi-VN", { month: "long" });
  const year = dateTime.getFullYear();
  const hour = dateTime.getHours();
  const minute = dateTime.getMinutes();

  return `${hour}:${minute}-${day} ${month} ${year}`;
}
export function formatDateToUNIX(value) {
  // Convert the date string to a JavaScript Date object
  var selectedDate = new Date(value);

  // Get the Unix timestamp in milliseconds
  var unixTimestamp = selectedDate.getTime();

  return unixTimestamp;
}
export const formatImgUrl = (value) => {
  // Check if value is an array
  if (!Array.isArray(value)) {
    return "Không có ảnh";
  }

  return (
    <>
      {value.length > 0
        ? value.map((url, index) => (
            <p key={index}>
              <button>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Ảnh {index + 1}
                </a>
              </button>
            </p>
          ))
        : "Không có ảnh"}
    </>
  );
};

export const UserRoleFormat = (value) => {
  switch (value) {
    case UserRole.DISTRICT_ADMIN:
      return UserRoleName[UserRole.DISTRICT_ADMIN];
    case UserRole.ADMIN:
      return UserRoleName[UserRole.ADMIN];
    case UserRole.WARD_ADMIN:
      return UserRoleName[UserRole.WARD_ADMIN];
    default:
      return UserRoleName[UserRole.ADMIN];
  }
};