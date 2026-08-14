'use client';
import { sortLatestFirst } from '@/utils/tableConfig';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Button,
    Box,
    Typography,
    Card,
    IconButton,
    Popover,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import { Add } from '@mui/icons-material';
import AddTimeSlot from '@/components/time-slot/addTimeSlot';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import { getTimeSlot } from '@/services/timeslotService';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import AssignSlotForBooking from '@/components/tee-time-management/assignSlotForBooking';

export default function TimeSlot() {
    const [open, setOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [timeSlot, setTimeSlot] = useState([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);

    const handleOpenAdd = () => {
        setOpen(true);
    };

    const handleCloseAdd = () => {
        setOpen(false);
    };

    const handleViewSlots = (rowId: string) => {
        setSelectedTimeSlotId(rowId);
        setOpenView(true);
    };

    const handleCloseViewSlots = () => {
        setOpenView(false);
    }

    const rows = sortLatestFirst(timeSlot).map((row, index) => ({
        ...row,
        sNo: index + 1,
    }));


    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 70, sortable: false },
        {
            field: 'start_date', headerName: 'Start Date', flex: 1, minWidth: 120,
            renderCell: (params) => moment(params?.row?.start_date).format('MM/DD/YYYY')
        },
        {
            field: 'course_name',
            headerName: 'Course Name',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => params.row.course?.name
        },
        {
            field: 'slot_time',
            headerName: 'Slot Time',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                const row = params?.row;
                return row ? `${row.slot_time_hours || 0}h ${row.slot_time_minutes || 0}m` : '';
            }
        },
        {
            field: 'buffer_time', headerName: 'Buffer Time', flex: 1, minWidth: 100,
            renderCell: (params) => {
                const row = params?.row;
                return row ? `${row.buffer_time || 0}m` : '';
            }
        },
        {
            field: 'weekday_opening_time',
            headerName: 'Weekdays Timing',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                const row = params?.row;
                return row ? `${row.weekday_opening_time || ''} - ${row.weekday_closing_time || ''}` : '';
            }
        },
        {
            field: 'weekend_opening_time',
            headerName: 'Weekends Timing',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                const row = params?.row;
                return row ? `${row.weekend_opening_time || ''} - ${row.weekend_closing_time || ''}` : '';
            }
        },
        {
            field: 'view_slots',
            headerName: 'Action',
            flex: 1,
            minWidth: 120,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewSlots(params.row._id)}
                    >
                        View Slots
                    </Button>
                );
            }
        },
    ];

    const fetchTimeSlot = async () => {
        try {
            const response = await getTimeSlot() as any[];
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
            <Box sx={{ width: '100%', minWidth: 0 }}>
                <Stack direction="row" alignItems="center" mb={3} justifyContent="space-between">
                    <Typography variant="h6">Time Slot Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Slot
                    </Button>
                </Stack>

                <TableStyle>
                    <Card sx={{ width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pagination
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[10, 20, 50, 100]}
                            getRowId={(row) => row?._id}
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
                    <AssignSlotForBooking timeSlotId={selectedTimeSlotId} />
                </DialogContent>
            </Dialog>
        </>
    );
}
