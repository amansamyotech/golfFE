'use client';
import { sortLatestFirst } from '@/utils/tableConfig';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Button,
    Typography,
    Card,
    Box,
    IconButton,
    MenuItem,
    Popover,
    Chip
} from '@mui/material';
import { Add, Delete, MoreVert, Edit, Visibility, Height } from '@mui/icons-material';
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
import AssignSlotToGuest from '@/components/guest/assignSlotToGuest';
import AssignCaddy from '@/components/tee-time-management/assignCaddy';
import AddPayment from '@/components/payment/addPayment';
interface Guest {
    _id: string;
    name: string;
    email: string;
    course: { _id: string; name: string };
    groupSize: number;
    dateTime: string;
    customerId: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        startDate: string;
    };
    role: string;
    slotIds: { start: string; end: string }[];
    bookingStatus: string;
    isDeleted?: boolean;
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

export default function GuestManagement() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState<Guest | undefined>(undefined);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [openAssignSlot, setOpenAssignSlot] = useState(false);
    const [slotsAvailable, setSlotsAvailable] = useState<boolean | null>(null);
    const [openAssignCaddy, setOpenAssignCaddy] = useState(false);
    const [openPayment, setOpenPayment] = useState(false);


    const rows = sortLatestFirst(guests).map((row, index) => ({
        ...(row || {}),
        sNo: index + 1,
        name: row.customerId ? row.customerId.name : row.name,
        role: row.customerId ? row.customerId.role : row.role,
        courseName: row.course?.name || '',
    }));

    const handleOpenAssignSlots = (row: any) => {
        setRowData(row);
        setOpenAssignSlot(true);
    }

    const handleCloseAssignSlots = () => {
        setRowData(null);
        setOpenAssignSlot(false);
    }


    const handleOpenAssignCaddy = (row: any) => {
        setSelectedId(row._id);
        setOpenAssignCaddy(true);
    }

    const handleCloseAssignCaddy = () => {
        setSelectedId(null);
        setOpenAssignCaddy(false);
    }

    const handleOpenPayment = (row: any) => {
        setRowData(row);
        setOpenPayment(true);
    }

    const handleClosePayment = () => {
        setRowData(null);
        setOpenPayment(false);
    }

    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 70, sortable: false },
        {
            field: 'name',
            headerName: 'Contact Info',
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2">{params.row.customerId.name}</Typography>
                    <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                        {params.row.customerId.phone}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'startDate', headerName: 'Booking Date', flex: 1, minWidth: 130, renderCell: (params) => {
                const dateValue = params.row.customerId?.startDate;

                if (!dateValue) return '--';

                const formattedDate = moment(dateValue).format('MMM DD, YYYY');

                return (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="100%"
                    >
                        <Typography
                            variant="body2"
                            sx={{ textAlign: 'center' }}
                        >
                            {formattedDate}
                        </Typography>
                    </Box>

                );
            },
        },
        {
            field: 'slotIds', headerName: 'Slot Time', flex: 1, minWidth: 120, renderCell: (params) => {
                const slots = params.row.slotIds;
                if (!slots || slots.length === 0) return '--';

                const slot = slots[0];

                const startTime = moment(slot.start, 'YYYY-MM-DD HH:mm').format('hh:mm A');
                const endTime = moment(slot.end, 'YYYY-MM-DD HH:mm').format('hh:mm A');

                return (

                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="100%"
                    >
                        <Typography variant="body2" sx={{ textAlign: 'center' }}>
                            {`${startTime} -`}
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'center' }}>
                            {`${endTime}`}
                        </Typography>
                        {/* ${endTime} */}
                    </Box>);
            },
        },
        {
            field: 'bookingStatus',
            headerName: 'Booking Status',
            flex: 1,
            minWidth: 130,
            renderCell: (params) => {
                const status = params.value;
                const statusColorMap = {
                    pending: 'warning',
                    confirmed: 'info',
                    completed: 'success',
                    canceled: 'error',
                };

                const chipColor = statusColorMap[status] || 'default';

                const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '-';

                return (
                    <Chip
                        label={label}
                        color={chipColor}
                        size="small"
                        variant="outlined"
                        sx={{
                            width: '100%',
                            borderRadius: '5px',
                            textTransform: 'capitalize',
                            fontSize: '13px',
                            padding: '0px',
                            margin: '0px'
                        }}
                    />
                );
            },
        },
        {
            field: 'assignSlot',
            headerName: 'Assign Slot',
            width: 100,
            sortable: false,
            renderCell: (params) => {
                const isConfirmed = params.row.bookingStatus === 'confirmed';

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenAssignSlots(params.row)}
                        disabled={isConfirmed}
                        sx={{
                            textTransform: 'none',
                            opacity: isConfirmed ? 0.6 : 1,
                            cursor: isConfirmed ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Assign Slot
                    </Button>
                );
            },
        },
        {
            field: 'assignCaddy',
            headerName: 'Assign Caddy',
            width: 120,
            sortable: false,
            renderCell: (params) => {
                const canAssignCaddy = params.row.caddyCart === true;
                const isCaddyAssign = params.row.caddyId ? true : false

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenAssignCaddy(params.row)}
                        disabled={!canAssignCaddy || isCaddyAssign}
                        sx={{
                            textTransform: 'none',
                            opacity: !canAssignCaddy ? 0.6 : 1,
                            cursor: !canAssignCaddy ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {/* Assign Caddy */}
                        {canAssignCaddy ? 'Assign Caddy' : 'Not Selected'}
                    </Button>
                );
            },
        },
        {
            field: 'paymentAction',
            headerName: 'Make Payment',
            width: 120,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Button

                        variant="contained"
                        color='success'
                        size="small"
                        style={{ textTransform: 'none', width: '100%' }}
                        disabled={params.row.paymentStatus === 'paid'}
                        onClick={() => handleOpenPayment(params.row)}
                    >
                        Pay Now
                    </Button>
                );
            },
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 100,
            sortable: false,
            renderCell: (params: GridRenderCellParams<Guest>) => (
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

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedId(null);
        handleClosePopover();
    };

    const fetchAllBookings = async () => {
        try {
            const response = await getBooking() as unknown as Guest[];
            const filterData = response.filter((data: Guest) => data?.customerId?.role === "guest" && data?.isDeleted !== true);
            setGuests(filterData as Guest[]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, [open, openDelete, openAssignSlot, openPayment]);

    return (
        <>
            <AddPayment open={openPayment} handleClose={handleClosePayment} data={rowData} />
            <AssignCaddy open={openAssignCaddy} handleClose={handleCloseAssignCaddy} id={selectedId} />
            <AssignSlotToGuest open={openAssignSlot} onClose={handleCloseAssignSlots} data={rowData} onSlotsLoaded={setSlotsAvailable} />
            <AddGuestBookings open={open} handleClose={handleCloseAdd} data={rowData} />
            <DeleteBooking open={openDelete} handleClose={handleCloseDelete} id={selectedId} />
            <Box sx={{ width: '100%', minWidth: 0 }}>
                <Stack direction="row" alignItems="center" mb={3} justifyContent="space-between">
                    <Typography variant="h6">Guest Booking Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} disabled={slotsAvailable === false} sx={{ textTransform: 'none' }}>
                        New Booking
                    </Button>
                </Stack>
                <TableStyle>
                    <Card sx={{ width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            rowCount={rows.length}
                            pagination
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[10, 20, 50, 100]}
                            getRowId={(row) => row._id}
                            sx={{
                                border: 0,
                                width: '100%',
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
            </Box>
        </>
    );
}
