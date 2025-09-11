'use client';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Button,
    Container,
    Typography,
    Card,
    Box,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Popover
} from '@mui/material';
import { Add, Delete, MoreVert, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import AddCourse from '@/components/course/addCourse';
import DeleteCourse from '@/components/course/deleteCourse';
import { getAllCourses } from '@/services/courseService';
import TeeTimeBooking from '@/components/tee-time-management/addTeeTimeBooking';
import { getAllGuest } from '@/services/guestService';
import moment from "moment";

export default function TeeTimeManagement() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [rowData, setRowData] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [courses, setCourses] = useState([]);
    const [bookings, setBookings] = useState([]);

    // const paginatedRows = courses.slice(
    //     paginationModel.page * paginationModel.pageSize,
    //     (paginationModel.page + 1) * paginationModel.pageSize
    // );

    // const rows = paginatedRows.map((row, index) => ({
    //     ...row,
    //     sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    // }));

    const paginatedRows = bookings.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
        name: row.memberId ? row.memberId.name : row.name,
        courseName: row.course?.name || '',
        email: row.memberId ? row.memberId.email : row.email,
        phone: row.memberId ? row.memberId.phone : row.phone,
        startDateTime: moment(row.startDateTime).format('YYYY-MM-DD') || '',
        endDateTime: moment(row.endDateTime).format('YYYY-MM-DD') || '',
    }));

    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setRowData(row);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleOpenEdit = (row: any) => {
        setRowData(row);
        setOpen(true);
        handleClosePopover();
    };

    const handleOpenAdd = () => {
        setRowData(null);
        setOpen(true);
    };

    const handleCloseAdd = () => {
        setOpen(false);
        setRowData(null);
    };

    const handleDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setRowData(null);
        handleClosePopover();
    };

    const fetchCourses = async () => {
        try {
            const response = await getAllCourses();
            setCourses(response);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [open, openDelete]);

    const fetchAllBookings = async () => {
        try {
            const response = await getAllGuest();
            console.log("------------> Fetched booking :", response);
            setBookings(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, []);


    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 80, sortable: false },
        {
            field: 'name', headerName: 'Guest Name', flex: 1
        },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Phone', flex: 1 },
        { field: 'courseName', headerName: 'Course Name', flex: 1 },
        { field: 'startDateTime', headerName: 'Start Time', flex: 1 },
        { field: 'endDateTime', headerName: 'End Time', flex: 1 },
        {
            field: 'action',
            headerName: 'Action',
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton onClick={(e) => handleClick(e, params.row)}>
                        <MoreVert fontSize="small" />
                    </IconButton>
                    <Popover
                        open={Boolean(anchorEl) && rowData?._id === params.row._id}
                        anchorEl={anchorEl}
                        onClose={handleClosePopover}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                        <MenuItem onClick={() => handleOpenEdit(params.row)}>
                            <Edit fontSize="small" style={{ marginRight: 8 }} /> Edit
                        </MenuItem>
                        <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
                            <Delete fontSize="small" style={{ marginRight: 8 }} /> Delete
                        </MenuItem>
                    </Popover>
                </>
            )
        }
    ];

    return (
        <>
            <TeeTimeBooking open={open} handleClose={handleCloseAdd} data={rowData} />
            <DeleteCourse open={openDelete} handleClose={handleCloseDelete} id={rowData?._id} />
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Tee-Time Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Booking
                    </Button>
                </Stack>

                <TableStyle>
                    <Card sx={{ height: '100vh' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pagination
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[5, 10]}
                            getRowId={(row) => row?._id}
                            sx={{
                                border: 0,
                                '& .MuiDataGrid-row': {
                                    borderBottom: '1px solid #eee',
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#fafafa',
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                    </Card>
                </TableStyle>
            </Container>
        </>
    );
}
