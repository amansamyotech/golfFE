'use client';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Button,
    Container,
    Typography,
    Card,
    Chip,
    Box,
    IconButton,
    Popover,
    MenuItem,
} from '@mui/material';
import { Add, Delete, MoreVert, Edit, Visibility } from '@mui/icons-material';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import DeleteCourse from '@/components/course/deleteCourse';
import { getAllCourses } from '@/services/courseService';
import TeeTimeBooking from '@/components/tee-time-management/addTeeTimeBooking';
import moment from "moment";
import { getBooking } from '@/services/bookingService';
import Link from 'next/link';
import AssignSlotModalWithTabs from '@/components/tee-time-management/assignSlotOptionModal';
import AssignCaddy from '@/components/tee-time-management/assignCaddy';
import AddPayment from '@/components/payment/addPayment';

interface Booking {
    _id: string;
    customerId?: {
        _id?: string;
        name?: string;
        email?: string;
        phone?: string;
        role?: string;
        startDate?: string;
    };
    name?: string;
    email?: string;
    phone?: string;
    course?: {
        name?: string;
    };
    startDateTime: string;
    endDateTime: string;
    groupSize?: number | string;
    isCaddy?: boolean;
    specialInfo?: string;
    startTime?: string;
    endTime?: string;
    bookingType?: string;
};

export default function TeeTimeManagement() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState<Booking | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [openAssignSlot, setOpenAssignSlot] = useState(false);
    const [slotsAvailable, setSlotsAvailable] = useState<boolean | null>(null);
    const [openAssignCaddy, setOpenAssignCaddy] = useState(false);
    const [openPayment, setOpenPayment] = useState(false);

    const paginatedRows = bookings.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
        name: row.customerId ? row.customerId.name : row.name,
        courseName: row.course?.name || '',
        startDate: moment(row.customerId?.startDate).format('DD-MM-YYYY') || '',
        slotTiming: row.startTime ? `${moment(row.startTime).format('HH:mm')} to ${moment(row.endTime).format('HH:mm')}` : '- -',
    }));

    const handleOpenPayment = (row: any) => {
        setRowData(row);
        setOpenPayment(true);
    }

    const handleClosePayment = () => {
        setRowData(null);
        setOpenPayment(false);
    }

    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 80, sortable: false },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            renderCell: (params: GridRenderCellParams<Booking>) => (
                <Link
                    href={`/tee-time-management/${params.row._id}`}
                    style={{
                        color: "#1976d2",
                        textDecoration: "underline",
                        cursor: "pointer"
                    }}
                >
                    {params?.row?.customerId?.name}
                </Link>
            ),
        },

        // {
        //     field: 'email',
        //     headerName: 'Contact Info',
        //     flex: 1,
        //     renderCell: (params: GridRenderCellParams<Booking>) => (
        //         <Box display="flex" flexDirection="column">
        //             <Typography variant="body2">{params.row.customerId.email}</Typography>
        //             <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
        //                 {params.row.customerId.phone}
        //             </Typography>
        //         </Box>
        //     ),
        // },

        {
            field: 'startDate', headerName: 'Booking Date', flex: 1, renderCell: (params) => {
                const dateValue = params.row.customerId?.startDate;

                if (!dateValue) return '--';

                const formattedDate = moment(dateValue).format('DD MMM YYYY');

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
            field: 'bookingType', headerName: 'Booking Type', flex: 1,
            renderCell: (params: any) => {
                const value = params.value || '';
                const formattedValue =
                    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                return formattedValue;
            },

        },
        {
            field: 'bookingStatus',
            headerName: 'Booking Status',
            flex: 1,
            width: 100,
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
                        }}
                    />
                );
            },
        },
        {
            field: 'assignSlot',
            headerName: 'Assign Slot',
            width: 120,
            sortable: false,
            renderCell: (params: { row: Booking }) => {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenAssignSlots(params.row)}
                        // disabled={isConfirmed}
                        sx={{ textTransform: 'none' }}
                    >
                        Assign Slot
                    </Button>
                );
            }
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
                        {canAssignCaddy ? 'Assign Caddy' : 'Not Selected'}
                    </Button>
                );
            },
        },
        // {
        //     field: 'bookedSlot',
        //     headerName: 'View',
        //     width: 120,
        //     sortable: false,
        //     renderCell: (params: { row: Booking }) => (
        //         <Link href={`/tee-time-management/${params.row._id}`} passHref>
        //             <Button
        //                 variant="contained"
        //                 color="primary"
        //                 size="small"
        //                 sx={{ textTransform: "none" }}
        //             >
        //                 View Booking
        //             </Button>

        //         </Link>

        //     )
        // },


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
                        //disabled={params.row.paymentStatus === 'pending' || params.row.paymentStatus === 'paid'}
                        onClick={() => handleOpenPayment(params.row)}
                    >
                        Pay Now
                    </Button>
                );
            },
        }
    ];

    const handleClick = (event: React.MouseEvent<HTMLElement>, row: Booking) => {
        setAnchorEl(event.currentTarget);
        setRowData(row);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleOpenEdit = (row: Booking) => {
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

    const handleOpenAssignCaddy = (row: any) => {
        setRowData(row);
        setOpenAssignCaddy(true);
    }

    const handleCloseAssignCaddy = () => {
        setRowData(null);
        setOpenAssignCaddy(false);
    }

    const fetchCourses = async () => {
        try {
            await getAllCourses();
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [open, openDelete]);

    const fetchAllBookings = async () => {
        try {
            const response = await getBooking() as Booking[];
            const filterData = response?.filter((data: Booking) => data?.customerId?.role === "member")
            setBookings(filterData as Booking[]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, [open, openAssignSlot, openPayment]);

    const handleOpenAssignSlots = (row: Booking) => {
        setRowData(row);
        setOpenAssignSlot(true);
    }
    const handleCloseAssignSlots = () => {
        setRowData(null);
        setOpenAssignSlot(false);
    }

    return (
        <>
            <AddPayment open={openPayment} handleClose={handleClosePayment} data={rowData} />
            <AssignCaddy open={openAssignCaddy} handleClose={handleCloseAssignCaddy} id={rowData?._id} />
            <TeeTimeBooking open={open} handleClose={handleCloseAdd} data={rowData} />
            <DeleteCourse open={openDelete} handleClose={handleCloseDelete} id={rowData?._id || ''} />
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Tee-Time Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} disabled={slotsAvailable === false} sx={{ textTransform: 'none' }}>
                        New Booking
                    </Button>
                </Stack>

                <TableStyle>
                    <Card sx={{ height: '400px' }}>
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
            <AssignSlotModalWithTabs open={openAssignSlot} onClose={handleCloseAssignSlots} data={rowData} onSlotsLoaded={setSlotsAvailable} />
        </>
    );
}
