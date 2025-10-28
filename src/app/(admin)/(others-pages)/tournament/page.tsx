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
    DialogContent,
    Chip,
    Box
} from '@mui/material';
import { Add, Edit, Delete, MoreVert, Visibility, CircleNotificationsOutlined } from '@mui/icons-material';
import AddTimeSlot from '@/components/time-slot/addTimeSlot';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import { getTimeSlot } from '@/services/timeslotService';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import AssignSlotForBooking from '@/components/tee-time-management/assignSlotForBooking';
import AddTournament from '@/components/tournament/addTournament';
import { getTournament } from '@/services/tournamentService';
import Link from 'next/link';
import CancelTournament from '@/components/tournament/cancelTournament';
import AssignPlayerToTournament from '@/components/tournament/assignPlayerForTournament';
import TournamentStatusChanger from '@/components/tournament/changeStatus';


export default function Tournament() {
    const [open, setOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [courses, setCourses] = useState([]);
    const [timeSlot, setTimeSlot] = useState([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);
    const [assignPlayerOpen, setAssignPlayerOpen] = useState(false);
    const [openStatusChange, setOpenStatusChange] = useState(false);

    const handleOpenAdd = () => {
        setOpen(true);
    };

    const handleCloseAdd = () => {
        setOpen(false);
    };

    const handleOpenStatusChange = () => {
        setOpenStatusChange(true);
    };

    const handleCloseStatusChange = () => {
        setOpenStatusChange(false);
        handleClosePopover();
    };

    const handleOpenAssignPlayer = (row) => {
        setRowData(row);
        setAssignPlayerOpen(true);
    };

    const handleCloseAssignPlayer = () => {
        setRowData(null);
        setAssignPlayerOpen(false);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleOpenEdit = () => {
        setOpen(true);
        handleClosePopover();
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
        setAnchorEl(event.currentTarget);
        setRowData(row);
    };

    const handleViewSlots = (rowId: string) => {
        setSelectedTimeSlotId(rowId);
        setOpenView(true);
    };

    const handleCloseViewSlots = () => {
        setOpenView(false);
    }

    const handleDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setRowData(null);
        handleClosePopover();
    };

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
            field: 'name',
            headerName: 'Name',
            flex: 1,
            renderCell: (params) => params.row.name
        },
        {
            field: 'startDate', headerName: 'Start Date', flex: 1,
            renderCell: (params) => moment(params?.row?.startDate).format('DD-MM-YYYY')
        },
        {
            field: 'endDate', headerName: 'End Date', flex: 1,
            renderCell: (params) => moment(params?.row?.endDate).format('DD-MM-YYYY')
        },
        {
            field: 'location',
            headerName: 'Location',
            flex: 1,
            renderCell: (params) => params.row.location
        },
        // {
        //     field: 'course',
        //     headerName: 'Course',
        //     flex: 1,
        //     renderCell: (params) => params.row.course?.name
        // },
        // {
        //     field: 'format',
        //     headerName: 'Format',
        //     flex: 1,
        //     renderCell: (params) => params.row.format
        // },
        {
            field: 'participants',
            headerName: 'Participants',
            flex: 1,
            renderCell: (params) => {
                const play = params.row.participantsPlay ?? 0;
                const required = params.row.participantsRequired ?? 0;
                return (
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        width="100%"
                    >
                        <Typography
                            variant="body2"
                            sx={{ lineHeight: 1.5, fontSize: '14px' }}
                        >
                            {play} / {required}
                        </Typography>
                    </Box>
                );

            }
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            width: 100,
            renderCell: (params) => {
                const status = params.value;

                const statusColorMap = {
                    planned: 'warning',
                    ongoing: 'info',
                    completed: 'success',
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
        // {
        //     field: 'addPlayers',
        //     headerName: 'Add Players',
        //     width: 120,
        //     sortable: false,
        //     renderCell: (params) => {
        //         return (
        //             <Button
        //                 variant="contained"
        //                 color="primary"
        //                 size="small"
        //                 sx={{ textTransform: 'none' }}
        //                 // onClick={handleOpenAssignPlayer}
        //                 onClick={() => handleOpenAssignPlayer(params.row)}
        //             >
        //                 Add Players
        //             </Button>
        //         );
        //     }
        // },
        {
            field: 'addPlayers',
            headerName: 'Add Players',
            width: 140,
            sortable: false,
            renderCell: (params) => {
                const required = params.row.participantsRequired ?? 0;
                const isDisabled = required === 0;

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ textTransform: 'none' }}
                        disabled={isDisabled}
                        onClick={() => handleOpenAssignPlayer(params.row)}
                    >
                        {isDisabled ? 'Full' : 'Add Players'}
                    </Button>
                );
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 80,
            sortable: false,
            renderCell: (params: any) => {
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
                            <MenuItem
                                component={Link}
                                href={params?.row?._id ? `/tournament/${params.row._id}` : "#"}
                                sx={{ color: "blue" }}
                            >
                                <Visibility fontSize="small" style={{ marginRight: 8 }} /> View
                            </MenuItem>
                            <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
                                <Delete fontSize="small" style={{ marginRight: 8 }} /> Delete
                            </MenuItem>
                            <MenuItem onClick={handleOpenStatusChange} sx={{ color: 'blue' }}>
                                <CircleNotificationsOutlined fontSize="small" style={{ marginRight: 8 }} /> Change Status
                            </MenuItem>
                        </Popover>
                    </>
                );
            }
        }
    ];

    const fetchTournament = async () => {
        try {
            const response = await getTournament() as any[];
            setTimeSlot(response);
        } catch (error) {
            console.error('Error fetching tournament:', error);
        }
    };

    useEffect(() => {
        fetchTournament();
    }, [open, openDelete, openStatusChange, assignPlayerOpen]);

    return (
        <>
            <AssignPlayerToTournament open={assignPlayerOpen} handleClose={handleCloseAssignPlayer} data={rowData} />
            <AddTournament open={open} handleClose={handleCloseAdd} data={rowData} />
            <CancelTournament open={openDelete} handleClose={handleCloseDelete} id={rowData?._id || ''} />
            <TournamentStatusChanger open={openStatusChange} handleClose={handleCloseStatusChange} id={rowData?._id || ''} currentStatus={rowData?.status} />
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Tournament Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Event
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
