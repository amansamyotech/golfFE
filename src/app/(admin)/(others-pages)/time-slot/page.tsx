'use client';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Button,
    Container,
    Typography,
    Card,
    IconButton,
    Popover,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import { Add, MoreVert, Edit, Delete } from '@mui/icons-material';
import AddTimeSlot from '@/components/time-slot/addTimeSlot';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import { getAllCourses } from '@/services/courseService';
import { getTimeSlot } from '@/services/timeslotService';
import moment from 'moment';
import { GridRenderCellParams } from '@mui/x-data-grid';
import SlotManagementPage from '@/components/time-slot/viewTimeSlots';
import CloseIcon from '@mui/icons-material/Close';
import AssignSlotForBooking from '@/components/tee-time-management/assignSlotForBooking';


export default function TimeSlot() {

    const [open, setOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [courses, setCourses] = useState([]);
    const [timeSlot, setTimeSlot] = useState([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState(null);
    const [openView, setOpenView] = useState(false);

    const handleOpenAdd = () => {
        setOpen(true);
    };

    const handleCloseAdd = () => {
        setOpen(false);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleOpenEdit = () => {
        setOpen(true);
        handleClosePopover();
    };

    const handleDelete = () => {
        // setOpenDelete(true);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>, row: Member) => {
        setAnchorEl(event.currentTarget);
        setRowData(row);
    };

    const handleViewSlots = () => {
        setOpenView(true);
    }
    const handleCloseViewSlots = () => {
        setOpenView(false);
    }

    const paginatedRows = timeSlot.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    }));


    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 80, sortable: false },
        {
            field: 'start_date', headerName: 'Start Date', flex: 1,
            renderCell: (params) => moment(params?.row?.start_date).format('DD-MM-YYYY')
        },
        {
            field: 'course_name',
            headerName: 'Course Name',
            flex: 1,
            renderCell: (params) => params.row.course?.name
        },
        {
            field: 'slot_time',
            headerName: 'Slot Time',
            flex: 0.7,
            renderCell: (params) => {
                const row = params?.row;
                return row ? `${row.slot_time_hours || 0}h ${row.slot_time_minutes || 0}m` : '';
            }
        },
        { field: 'buffer_time', headerName: 'Buffer Time', flex: 0.7 },
        {
            field: 'weekday_opening_time',
            headerName: 'Weekdays Timing',
            flex: 1,
            renderCell: (params) => {
                const row = params?.row;
                return row ? `${row.weekday_opening_time || ''} - ${row.weekday_closing_time || ''}` : '';
            }
        },
        {
            field: 'weekend_opening_time',
            headerName: 'Weekends Timing',
            flex: 1,
            renderCell: (params) => {
                const row = params?.row;
                return row ? `${row.weekend_opening_time || ''} - ${row.weekend_closing_time || ''}` : '';
            }
        },
        {
            field: 'view_slots',
            headerName: 'Action',
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewSlots()}
                    >
                        View Slots
                    </Button>
                );
            }
        },
    ];

    const fetchTimeSlot = async () => {
        try {
            const response = await getTimeSlot();
            setTimeSlot(response);
        } catch (error) {
            console.error('Error fetching slot:', error);
        }
    };

    useEffect(() => {
        fetchTimeSlot();
    }, [open]);

    return (
        <>
            <AddTimeSlot open={open} handleClose={handleCloseAdd} data={rowData} />
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Time Slot Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Slot
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
            <Dialog open={openView} onClose={handleCloseViewSlots} maxWidth="md" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    Time Slot Management
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseViewSlots}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {/* <SlotManagementPage /> */}
                    <AssignSlotForBooking />
                </DialogContent>
            </Dialog>
        </>
    );
}
