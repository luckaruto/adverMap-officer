// import React, { useEffect, useState } from "react";
// import DataTable from "../../components/DataTable";
// import { CityService } from "../../services/city/CityService"; // Adjust the import path based on your project structure
// import { useDispatch, useSelector } from "react-redux";
// import { setLoading, setSnackbar } from "../../redux/appSlice";
// import { PAGE } from "../../components/constants";
// import Heading1 from "../../components/Text/Heading1";
// import Button from "@mui/material/Button";
// import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
// import { fetchCities } from "../../redux/citySlice";
// import { testParams } from "../../services/apis/constants"; // Assuming you have a citySlice similar to spaceSlice
//
// const columns = [
//     { id: "id", label: "ID" },
//     {
//         id: "name",
//         label: "Tên thành phố",
//         minWidth: 170,
//     },
//     // Add more columns based on your city data structure
// ];
//
// const CityPage = () => {
//     const [selectedRow, setSelectedRow] = useState(null);
//     const [openConfirm, setOpenConfirm] = useState(false);
//
//
//     const dispatch = useDispatch();
//
//     // @ts-ignore
//     const { token } = useSelector((state) => state.appState);
//     // @ts-ignore
//     const { entities, error, loading } = useSelector((state) => state.cities);
//
//     useEffect(() => {
//         console.log("Entities:", entities);
//     }, [entities]);
//
//
//     const handleOpenRequestForm = () => {
//         setSelectedRow(null);
//         // Open the form
//         setOpenForm(true);
//     };
//
//     const handleOpenForm = () => {
//         // Open the form
//         setOpenForm(true);
//     };
//
//     const handleCloseForm = () => {
//         // Close the form
//         setOpenForm(false);
//     };
//
//     const handleClickCreate = () => {
//         // Implement your logic for handling create action
//         handleOpenForm(); // Open the form for creating new city
//     };
//
//     const handleClickDelete = () => {
//         setOpenConfirm(true);
//     };
//
//     const handleClickRow = (row) => setSelectedRow(row);
//
//     const handleDelete = async () => {
//         const { id } = selectedRow;
//         dispatch(setLoading(true));
//         try {
//             const res = await CityService.deleteCity(id, token);
//             dispatch(setSnackbar({ status: "success", message: res }));
//             dispatch(fetchCities({ testParams, token }));
//         } catch (error) {
//             dispatch(setSnackbar({ status: "error", message: error }));
//         } finally {
//             setSelectedRow(null);
//             dispatch(setLoading(false));
//             setOpenConfirm(false);
//         }
//     };
//
//     useEffect(() => {
//         dispatch(fetchCities({ testParams, token }));
//     }, [dispatch, token]);
//
//     return (
//         <>
//             <div className="max-w-[1400px] m-auto flex flex-col gap-4">
//                 <Heading1>Danh sách thành phố</Heading1>
//                 <div className="flex gap-6 ml-auto">
//                     <Button
//                         variant="contained"
//                         color="info"
//                         onClick={handleOpenRequestForm}
//                         disabled={!selectedRow}
//                     >
//                         Chỉnh sửa
//                     </Button>
//                     <Button
//                         variant="outlined"
//                         color="success"
//                         onClick={handleClickCreate}
//                     >
//                         Tạo mới
//                     </Button>
//                     <Button
//                         variant="outlined"
//                         color="error"
//                         onClick={handleClickDelete}
//                         disabled={!selectedRow}
//                     >
//                         Xóa
//                     </Button>
//                 </div>
//
//                 {entities && entities.length > 0 ? (
//                     <DataTable
//                         columns={columns}
//                         rows={entities}
//                         onClickRow={handleClickRow}
//                         selectedRow={selectedRow}
//                     />
//                 ) : (
//                     <p className="text-center text-blue-400 text-lg font-bold">
//                         No data ...
//                     </p>
//                 )}
//
//                 {error && (
//                     <p className="text-center text-red-500 text-lg font-bold">{error}</p>
//                 )}
//
//                 <ConfirmModal
//                     open={openConfirm}
//                     handleClose={() => setOpenConfirm(false)}
//                     handleSubmit={handleDelete}
//                     message="Xác nhận xóa thành phố được chọn?"
//                 />
//             </div>
//         </>
//     );
// };
//
// export default CityPage;


import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { CityService } from "../../services/city/CityService"; // Adjust the import path based on your project structure
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setSnackbar } from "../../redux/appSlice";
import { PAGE } from "../../components/constants";
import Heading1 from "../../components/Text/Heading1";
import Button from "@mui/material/Button";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import CityForm from "./CityForm"; // Assuming you have the CityForm component in the same directory
import { fetchCities } from "../../redux/citySlice";
import { testParams } from "../../services/apis/constants";

const columns = [
    { id: "id", label: "ID" },
    {
        id: "name",
        label: "Tên thành phố",
        minWidth: 170,
    },
    // Add more columns based on your city data structure
];

const CityPage = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [openForm, setOpenForm] = useState(false); // Added state for form visibility
    const [openConfirm, setOpenConfirm] = useState(false);

    const dispatch = useDispatch();

    // @ts-ignore
    const { token } = useSelector((state) => state.appState);
    // @ts-ignore
    const { entities, error, loading } = useSelector((state) => state.cities);

    useEffect(() => {
        console.log("Entities:", entities);
    }, [entities]);

    const handleOpenRequestForm = () => {
        setSelectedRow(null);
        // Open the form
        setOpenForm(true);
    };

    const handleOpenForm = () => {
        // Open the form
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        // Close the form
        setOpenForm(false);
    };

    const handleClickCreate = () => {
        // Implement your logic for handling create action
        handleOpenForm(); // Open the form for creating new city
    };

    const handleClickDelete = () => {
        setOpenConfirm(true);
    };

    const handleClickRow = (row) => setSelectedRow(row);

    const handleDelete = async () => {
        const { id } = selectedRow;
        dispatch(setLoading(true));
        try {
            const res = await CityService.deleteCity(id, token);
            dispatch(setSnackbar({ status: "success", message: res }));
            dispatch(fetchCities({ testParams, token }));
        } catch (error) {
            dispatch(setSnackbar({ status: "error", message: error }));
        } finally {
            setSelectedRow(null);
            dispatch(setLoading(false));
            setOpenConfirm(false);
        }
    };

    useEffect(() => {
        dispatch(fetchCities({ testParams, token }));
    }, [dispatch, token]);

    return (
        <>
            <div className="max-w-[1400px] m-auto flex flex-col gap-4">
                <Heading1>Danh sách thành phố</Heading1>
                <div className="flex gap-6 ml-auto">
                    <Button
                        variant="contained"
                        color="info"
                        onClick={handleOpenRequestForm}
                        disabled={!selectedRow}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={handleClickCreate}
                    >
                        Tạo mới
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleClickDelete}
                        disabled={!selectedRow}
                    >
                        Xóa
                    </Button>
                </div>

                {entities && entities.length > 0 ? (
                    <DataTable
                        columns={columns}
                        rows={entities}
                        onClickRow={handleClickRow}
                        selectedRow={selectedRow}
                    />
                ) : (
                    <p className="text-center text-blue-400 text-lg font-bold">
                        No data ...
                    </p>
                )}

                {error && (
                    <p className="text-center text-red-500 text-lg font-bold">{error}</p>
                )}

                <ConfirmModal
                    open={openConfirm}
                    handleClose={() => setOpenConfirm(false)}
                    handleSubmit={handleDelete}
                    message="Xác nhận xóa thành phố được chọn?"
                />

                {/* CityForm component for handling edits and creates */}
                <CityForm
                    open={openForm}
                    handleClose={handleCloseForm}
                    existData={selectedRow}
                />
            </div>
        </>
    );
};

export default CityPage;