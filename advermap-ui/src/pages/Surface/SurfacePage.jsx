import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SurfaceServices } from "services/surface/SurfaceService";
import DataTable from "components/DataTable";
import { PAGE } from "components/constants";
import { useNavigate } from "react-router-dom";
import { testToken } from "services/apis/constants";
import SurfaceInfo from "./SurfaceInfo";
import { formatFormat, formatImgUrl } from "utils/format";
import Heading1 from "components/Text/Heading1";
import { fetchSurfaces } from "redux/surfaceSlice";
import { formatFormatUI } from "utils/formatToUI";
import Button from "@mui/material/Button";
import SurfaceForm from "./SurfaceForm";
import ConfirmModal from "components/ConfirmModal/ConfirmModal";
import { setLoading, setSnackbar } from "redux/appSlice";
import { UserRole } from "constants/types";
import SurfaceRequestForm from "pages/SurfaceRequest/SurfaceRequestForm";

const columns = [
  { id: "id", label: "ID" },
  {
    id: "space",
    label: "Địa chỉ",
    minWidth: 200,
    format: (value) => value.address,
  },

  {
    id: "height",
    label: "Chiều dài",
    minWidth: 150,
  },
  {
    id: "width",
    label: "Chiều rộng",
    minWidth: 150,
  },
  {
    id: "format",
    label: "Hình thức",
    minWidth: 170,
    format: formatFormatUI,
  },
  {
    id: "content",
    label: "Nội dung",
    minWidth: 200,
  },
  {
    id: "detail",
    label: "",
    value: "Xem Báo cáo",
  },
];

const SurfacePage = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const [openRequestForm, setOpenRequestForm] = useState(false);
  const navigate = useNavigate();

  // @ts-ignore

  // @ts-ignore
  const { entities, error, loading } = useSelector((state) => state.surfaces);
  const { token, snackbar, params, tokenPayload } = useSelector(
    // @ts-ignore
    (state) => state.appState
  );

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);
  const handleClickRow = (row) => setSelectedRow(row);
  const handleClickDetail = (row) => navigate(PAGE.SURFACE.path + `/${row.id}`);
  const handleClickCreate = () => {
    setSelectedRow(null);
    setTimeout(() => {
      handleOpenForm();
    }, 0);
  };
  const handleClickEdit = () => {
    handleOpenForm();
  };
  const handleClickDelete = () => {
    setOpenConfirm(true);
  };
  const handleCloseRequestForm = () => setOpenRequestForm(false);
  const handleOpenRequestForm = () => setOpenRequestForm(true);

  const handleDelete = async () => {
    const { id } = selectedRow;
    dispatch(setLoading(true));
    try {
      const res = await SurfaceServices.delete(id, token);
      console.log(res);
      dispatch(setSnackbar({ status: "success", message: res }));
      const { content } = params;
      // @ts-ignore
      dispatch(fetchSurfaces({ content, token }));
    } catch (error) {
      dispatch(setSnackbar({ status: "error", message: error }));
    } finally {
      setSelectedRow(null);
      dispatch(setLoading(false));
      setOpenConfirm(false);
    }
  };
  const { state } = useLocation();
  useEffect(() => {
    if (state) {
      setSelectedRow(state);
    }
  }, [state]);

  useEffect(() => {
    const id = location.pathname.split("/")[2];
    let reqParams;
    if (id) {
      reqParams = { spaceIds: id };
    } else reqParams = params.content;
    // @ts-ignore
    dispatch(fetchSurfaces({ params: reqParams, token }));
  }, [location, params]);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading]);

  return (
    <div className="max-w-[1400px] m-auto flex flex-col gap-6">
      <Heading1>Danh sách bảng Quảng Cáo</Heading1>
      <Button onClick={() => navigate(PAGE.SURFACE_REQUEST.path)}>
        Danh sách yêu cầu
      </Button>

      <div className="flex gap-6 ml-auto">
        {tokenPayload.role != UserRole.ADMIN && (
          <Button
            variant="contained"
            color="info"
            onClick={handleOpenRequestForm}
            disabled={!selectedRow}
          >
            Yêu cầu chỉnh sửa
          </Button>
        )}
        {tokenPayload.role == UserRole.ADMIN && (
          <>
            <Button
              variant="outlined"
              color="success"
              onClick={handleClickCreate}
            >
              Tạo mới
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={handleClickEdit}
              disabled={!selectedRow}
            >
              Chỉnh Sửa
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClickDelete}
              disabled={!selectedRow}
            >
              Xóa
            </Button>
          </>
        )}
      </div>
      {entities && entities.length > 0 ? (
        <DataTable
          columns={columns}
          rows={entities}
          onClickDetail={handleClickDetail}
          onClickRow={handleClickRow}
          selectedRow={selectedRow}
        />
      ) : (
        <p className="text-center text-blue-400 text-lg font-bold">
          No data ...
        </p>
      )}
      {error && (
        <p className="text-center text-red-500 text-lg font-bold">
          Error: {error.message} {/* Display a user-friendly error message */}
        </p>
      )}
      {selectedRow && <SurfaceInfo data={selectedRow} />}
      <SurfaceForm
        open={openForm}
        handleClose={handleCloseForm}
        existData={selectedRow}
      />
      <SurfaceRequestForm
        open={openRequestForm}
        handleClose={handleCloseRequestForm}
        existData={selectedRow}
      />

      <ConfirmModal
        open={openConfirm}
        handleClose={() => setOpenConfirm(false)}
        handleSubmit={handleDelete}
        message="Xác nhận xóa địa điểm được chọn?"
      />
    </div>
  );
};

export default SurfacePage;
