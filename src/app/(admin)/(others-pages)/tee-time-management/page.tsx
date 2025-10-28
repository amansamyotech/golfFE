'use client';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Button,
    Container,
    Typography,
    Card,
    Chip,
    Box
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

    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 80, sortable: false },
        {
            field: 'name',
            headerName: 'Contact Info',
            flex: 1,
            renderCell: (params: GridRenderCellParams<Booking>) => (
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2">{params.row.customerId.name}</Typography>
                    <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                        {params.row.customerId.phone}
                    </Typography>
                </Box>
            ),
        },
        { field: 'courseName', headerName: 'Course Name', flex: 1 },
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
            field: 'bookedSlot',
            headerName: 'Booked Slot',
            width: 120,
            sortable: false,
            renderCell: (params: { row: Booking }) => (
                <Link href={`/tee-time-management/${params.row._id}`} passHref>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ textTransform: "none" }}
                    >
                        Booked Slot
                    </Button>

                </Link>

            )
        },
        // {
        //     field: 'action',
        //     headerName: 'Action',
        //     width: 80,
        //     sortable: false,
        //     renderCell: (params: { row: Booking }) => (
        //         <>
        //             <IconButton onClick={(e) => handleClick(e, params.row)}>
        //                 <MoreVert fontSize="small" />
        //             </IconButton>
        //             <Popover
        //                 open={Boolean(anchorEl) && rowData?._id === params.row._id}
        //                 anchorEl={anchorEl}
        //                 onClose={handleClosePopover}
        //                 anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        //             >
        //                 <MenuItem onClick={() => handleOpenEdit(params.row)}>
        //                     <Edit fontSize="small" style={{ marginRight: 8 }} /> Edit
        //                 </MenuItem>
        //                 <MenuItem
        //                     component={Link}
        //                     href={params?.row?._id ? `/tee-time-management/${params.row._id}` : "#"}
        //                     sx={{ color: "blue" }}
        //                 >
        //                     <Visibility fontSize="small" style={{ marginRight: 8 }} /> View
        //                 </MenuItem>
        //             </Popover>
        //         </>
        //     )
        // },
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
    }, [open, openAssignSlot]);

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
            <AssignSlotModalWithTabs open={openAssignSlot} onClose={handleCloseAssignSlots} data={rowData} onSlotsLoaded={setSlotsAvailable} />
        </>
    );
}
