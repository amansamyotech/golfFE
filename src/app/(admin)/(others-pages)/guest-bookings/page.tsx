'use client';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Button,
    Container,
    Typography,
    Card,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Popover
} from '@mui/material';
import { Add, Delete, MoreVert, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import AddGuestBookings from '@/components/guest/addBooking';
import CheckCircle from '@mui/icons-material/CheckCircle';
import DeleteBooking from '@/components/guest/deleteBooking';
import { getAllGuest } from '@/services/guestService';
import moment from "moment";
import Link from 'next/link';

const staticRows = [
    {
        _id: '1',
        sNo: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        course: 'React Basics',
        groupSize: 10,
        dateTime: '2025-01-01 10:00 AM',
    },
    {
        _id: '2',
        sNo: 2,
        name: 'Bob Smith',
        email: 'bob@example.com',
        course: 'Advanced Node.js',
        groupSize: 8,
        dateTime: '2024-07-01 02:00 PM',
    },
    {
        _id: '3',
        sNo: 3,
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        course: 'Fullstack Bootcamp',
        groupSize: 12,
        dateTime: '2023-10-15 09:30 AM',
    },
    {
        _id: '4',
        sNo: 4,
        name: 'Diana Ross',
        email: 'diana@example.com',
        course: 'UI/UX Design',
        groupSize: 6,
        dateTime: '2024-03-20 01:00 PM',
    },
    {
        _id: '5',
        sNo: 5,
        name: 'Edward King',
        email: 'edward@example.com',
        course: 'Data Science Essentials',
        groupSize: 15,
        dateTime: '2025-06-01 11:15 AM',
    },
];

export default function GuestManagement() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [rowData, setRowData] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [guests, setGuests] = useState([]);

    const paginatedRows = guests.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    }));

    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 80 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        {
            field: 'course',
            headerName: 'course',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" mt={2}>
                    {params.row.course?.name || 'N/A'}
                </Typography>
            ),
        },
        { field: 'groupSize', headerName: 'Group Size', flex: 1 },
        {
            field: 'dateTime',
            headerName: 'Date & Time',
            flex: 1.5,
            renderCell: (params) => moment(params.value).format('YYYY-MM-DD'),
        },
        {
            field: 'more',
            headerName: 'More',
            width: 130,
            sortable: false,
            renderCell: (params) => (
                <Link href={`/guest-bookings/${params.row._id}`} passHref>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: '#f0f0f0',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                            }}

                        >
                            <Typography color="grey" fontSize="0.8rem" fontWeight={500}>
                                View More
                            </Typography>
                        </Box>
                    </Box>
                </Link>
            ),
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 80,
            sortable: false,
            renderCell: (params) => {
                return (
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
                            <MenuItem onClick={handleOpenEdit}>
                                <Edit fontSize="small" style={{ marginRight: 8 }} /> Edit
                            </MenuItem>
                            <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
                                <Delete fontSize="small" style={{ marginRight: 8 }} /> Delete
                            </MenuItem>
                            <MenuItem sx={{ color: 'blue' }}>
                                <CheckCircle fontSize="small" style={{ marginRight: 8 }} /> Approve Requests
                            </MenuItem>
                        </Popover>
                    </>
                );
            }
        }
    ];

    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setRowData(row);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleOpenEdit = () => {
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

    const fetchGuest = async () => {
        try {
            const response = await getAllGuest();
            setGuests(response);
        } catch (error) {
            console.error('Error fetching guest:', error);
        }
    };

    useEffect(() => {
        fetchGuest();
    }, [open, openDelete]);

    return (
        <>
            <AddGuestBookings open={open} handleClose={handleCloseAdd} data={rowData} />
            <DeleteBooking open={openDelete} handleClose={handleCloseDelete} id={rowData?._id} />
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Guest Booking Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Booking
                    </Button>
                </Stack>

                <TableStyle>
                    <Card sx={{ height: '100vh' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            rowCount={staticRows.length}
                            pagination
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[5, 10]}
                            getRowId={(row) => row._id}
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
