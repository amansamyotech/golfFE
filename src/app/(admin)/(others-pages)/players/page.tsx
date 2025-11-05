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
    Box,
    Chip
} from '@mui/material';
import { Add, Edit, Delete, MoreVert, Visibility } from '@mui/icons-material';
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
import AddPlayers from '@/components/players/addPlayers';
import { getPlayer } from '@/services/playersService';
import DeletePlayer from '@/components/players/deletePlayers';

export default function Players() {
    const [open, setOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [courses, setCourses] = useState([]);
    const [player, setPlayer] = useState([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);

    const handleOpenAdd = () => {
        setOpen(true);
    };

    const handleCloseAdd = () => {
        setOpen(false);
        setRowData(null);
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

    const paginatedRows = player.slice(
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
            field: 'profileImage',
            headerName: 'Profile Image',
            flex: 1,
            renderCell: (params) => {
                const imageUrl = params.value
                    ? `${process.env.NEXT_PUBLIC_API_IMG_URL}${params.value}`
                    : '/default-avatar.png';

                return (
                    <img
                        src={imageUrl}
                        alt="Profile"
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                    />
                );
            }
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            renderCell: (params) => params.row.name
        },
        {
            field: 'email',
            headerName: 'Contact Details',
            flex: 1.5,
            renderCell: (params) => (
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                        {params.row.phone}
                    </Typography>
                    <Typography variant="body2">{params.row.email}</Typography>
                </Box>
            ),
        },
        {
            field: 'gender',
            headerName: 'Gender',
            flex: 1,
            renderCell: (params) => params.row.course?.name
        },
        {
            field: 'age',
            headerName: 'Age',
            flex: 1,
            renderCell: (params) => params.row.age
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            width: 100,
            renderCell: (params) => {
                const status = params.value;

                const statusColorMap = {
                    registered: 'warning',
                    enrolled: 'info',
                    active: 'success',
                    inactive: 'error'
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
                            {/* <MenuItem
                                component={Link}
                                href={params?.row?._id ? `/members-management/${params.row._id}` : "#"}
                                sx={{ color: "blue" }}
                            >
                                <Visibility fontSize="small" style={{ marginRight: 8 }} /> View
                            </MenuItem> */}
                            <MenuItem onClick={handleOpenEdit}>
                                <Edit fontSize="small" style={{ marginRight: 8 }} /> Edit
                            </MenuItem>
                            <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
                                <Delete fontSize="small" style={{ marginRight: 8 }} /> Delete
                            </MenuItem>
                        </Popover>
                    </>
                );
            }
        }
    ];

    const fetchTournament = async () => {
        try {
            const response = await getPlayer() as any[];
            setPlayer(response);
        } catch (error) {
            console.error('Error fetching tournament:', error);
        }
    };

    useEffect(() => {
        fetchTournament();
    }, [open, openDelete]);


    return (
        <>
            <AddPlayers open={open} handleClose={handleCloseAdd} data={rowData} />
            <DeletePlayer open={openDelete} handleClose={handleCloseDelete} id={rowData?._id || ''} />
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Player Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Player
                    </Button>
                </Stack>

                <TableStyle>
                    <Card sx={{height: '400px'}}>
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
