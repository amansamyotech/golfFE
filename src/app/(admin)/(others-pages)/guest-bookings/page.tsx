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
    MenuItem,
    Popover,
    Chip
} from '@mui/material';
import { Add, Delete, MoreVert, Edit, Visibility } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import AddGuestBookings from '@/components/guest/addBooking';
import CheckCircle from '@mui/icons-material/CheckCircle';
import DeleteBooking from '@/components/guest/deleteBooking';
import { getAllGuest } from '@/services/guestService';
import moment from "moment";
import Link from 'next/link';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { getBooking } from '@/services/bookingService';




interface Guest {
    _id: string;
    name: string;
    email: string;
    course: { _id: string; name: string };
    groupSize: number;
    dateTime: string;
}

interface GuestBookingData {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    govId?: string;
    course: { _id: string; name: string };
    startDateTime?: string;
    endDateTime?: string;
    groupSize?: string;
    caddyCart?: boolean;
    amount?: number;
    paymentMode?: string;
    acceptRules?: boolean;
    acknowledgePolicy?: boolean;
}

const transformToGuestBookingData = (guest: Guest | undefined): GuestBookingData | undefined => {
    if (!guest) return undefined;
    return {
        _id: guest._id,
        name: guest.name,
        email: guest.email,
        course: guest.course,
        groupSize: guest.groupSize.toString(),
        startDateTime: guest.dateTime,
        endDateTime: undefined,
        phone: undefined,
        govId: undefined,
        caddyCart: undefined,
        amount: undefined,
        paymentMode: undefined,
        acceptRules: undefined,
        acknowledgePolicy: undefined,
    };
};



export default function GuestManagement() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState<Guest | undefined>(undefined);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [guests, setGuests] = useState<Guest[]>([]);

    const paginatedRows = guests.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...(row || {}),
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
        name: row.customerId ? row.customerId.name : row.name,
        role: row.customerId ? row.customerId.role : row.role,
        courseName: row.course?.name || '',
        startDate: moment(row.startTime).format('YYYY-MM-DD') || '',
        slotTiming: `${moment(row.startTime).format('HH:mm')} to ${moment(row.endTime).format('HH:mm')}`,
    }));

    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 80, sortable: false },
        {
            field: 'name', headerName: 'Customer Info', flex: 1
        },
        { field: 'courseName', headerName: 'Course Name', flex: 1 },
        { field: 'startDate', headerName: 'Booking Date', flex: 1 },
        { field: 'slotTiming', headerName: 'Slot Timing', flex: 1 },
        {
            field: 'more',
            headerName: 'Booking',
            width: 160,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                        }}
                        onClick={()=> handleDelete(params.row)}
                    >
                        Cancel Booking
                    </Button>
                </Box>
            ),
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 100,
            sortable: false,
            renderCell: (params: { row: Booking }) => (
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
                        <MenuItem
                            component={Link}
                            href={params?.row?._id ? `/guest-bookings/${params.row._id}` : "#"}
                            sx={{ color: "blue" }}
                        >
                            <Visibility fontSize="small" style={{ marginRight: 8 }} /> View
                        </MenuItem>
                    </Popover>
                </>
            )
        }
    ];

    const handleClick = (event: React.MouseEvent<HTMLElement>, row: Guest) => {
        setAnchorEl(event.currentTarget);
        setRowData(row);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleOpenEdit = (row) => {
        setRowData(row);
        setOpen(true);
        handleClosePopover();
    };

    const handleOpenAdd = () => {
        setRowData(undefined);
        setOpen(true);
    };

    const handleCloseAdd = () => {
        setOpen(false);
        setRowData(undefined);
    };

    const handleDelete = (row) => {
        setSelectedId(row._id);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedId(null);
        handleClosePopover();
    };

    const fetchAllBookings = async () => {
        try {
            const response = await getBooking();
            const filterData = response?.filter((data: Guest) => data?.customerId?.role === "guest")
            setGuests(filterData as Guest[]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, [open, openDelete]);

    return (
        <>
            <AddGuestBookings open={open} handleClose={handleCloseAdd} data={rowData} />
            <DeleteBooking open={openDelete} handleClose={handleCloseDelete} id={selectedId} />
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
                            rowCount={rows.length}
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
