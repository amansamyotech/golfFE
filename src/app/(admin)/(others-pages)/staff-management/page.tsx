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
    MenuItem,
    Popover,
    Chip
} from '@mui/material';
import { Add, Delete, MoreVert, Edit, Schedule, CheckCircle } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import AddEmployee from '@/components/staff-management/addStaff';
import DeleteStaff from '@/components/staff-management/deleteStaff';
import { getAllStaff } from '@/services/staffService';
import moment from 'moment';
import Image from 'next/image';
import { GridColDef } from '@mui/x-data-grid';
import Link from 'next/link';
import WorkingShiftChanger from '@/components/staff-management/changeShift';
import ChangeAvailability from '@/components/staff-management/changeStatus';
import type { Metadata } from 'next';

const metadata: Metadata = {
    title: "Golf CRM - Staff Management",
    description: "Manage Staff Data to keep their track."
}

interface StaffMember {
    _id: string;
    profileImg?: string;
    name: string;
    email: string;
    jobTitle: string;
    department: string;
    dateOfJoining: string;
    title: string;
    workShift: string;
    availabilityStatus: string;
}

// const defaultImage = 'https://via.placeholder.com/40';

export default function StaffManagement() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState<StaffMember | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openWorkingShift, setWorkingShiftModal] = useState(false);
    const [openStatusChange, setOpenStatusChange] = useState(false);
    const [staff, setStaffMembers] = useState<StaffMember[]>([]);

    const rows = sortLatestFirst(staff).map((row, index) => ({
        ...row,
        sNo: index + 1,
    }));


    const columns: GridColDef[] = [
        { field: 'sNo', headerName: 'S.No', width: 70 },
        {
            field: 'profileImg',
            headerName: 'Image',
            width: 70,
            sortable: false,
            renderCell: (params: { row: StaffMember }) => {
                const imgSrc = params.row.profileImg
                    ? `${process.env.NEXT_PUBLIC_API_IMG_URL}${params.row.profileImg}`
                    : "";

                return (
                    <Image
                        src={imgSrc}
                        alt={params.row.name || 'Profile'}
                        width={40}
                        height={40}
                        style={{ borderRadius: 4, objectFit: 'cover' }}
                    />
                );
            },
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 140,
            renderCell: (params) => (
                <Link
                    href={`/staff-management/${params.row._id}`}
                    style={{
                        color: "#1976d2",
                        textDecoration: "underline",
                        cursor: "pointer"
                    }}
                >
                    {params?.row?.name}
                </Link>
            ),
        },

        { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
        { field: 'jobTitle', headerName: 'Job Title', flex: 1, minWidth: 130 },
        { field: 'department', headerName: 'Department', flex: 1, minWidth: 130 },
        { field: 'workShift', headerName: 'Shift', flex: 1, minWidth: 110 },
        {
            field: 'availabilityStatus',
            headerName: 'Status',
            flex: 1,
            minWidth: 110,
            renderCell: (params) => {
                const status = params.value;

                const statusColorMap = {
                    available: 'success',
                    assigned: 'info',
                    onleave: 'error',
                    inactive: "warring"
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

                            <MenuItem
                                onClick={() => handleOpenWorkingShift(params.row)}
                                sx={{ color: 'blue' }}
                            >
                                <Schedule fontSize="small" style={{ marginRight: 8 }} /> Change Shift
                            </MenuItem>

                            <MenuItem
                                onClick={() => handleOpenAvailabilityModal(params.row)}
                                sx={{ color: 'green' }}
                            >
                                <CheckCircle fontSize="small" style={{ marginRight: 8 }} /> Change Availability
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

    const handleClick = (event: React.MouseEvent<HTMLElement>, row: StaffMember) => {
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


    const handleOpenWorkingShift = (row: any) => {
        setRowData(row);
        setWorkingShiftModal(true);
    };

    const handleCloseWorkingShift = () => {
        setWorkingShiftModal(false);
        setRowData(null);
        handleClosePopover();
    };

    const handleDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setRowData(null);
        handleClosePopover();
    };

    const handleOpenAvailabilityModal = (row: any) => {
        setRowData(row);
        setOpenStatusChange(true);
    };

    const handleCloseAvailabilityModal = () => {
        setOpenStatusChange(false);
        setRowData(null);
        handleClosePopover();
    };

    const fetchStaff = async () => {
        try {
            const response = await getAllStaff();
            setStaffMembers(response as StaffMember[]);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [open, openDelete, openWorkingShift, openStatusChange]);



    return (
        <>
            <AddEmployee open={open} handleClose={handleCloseAdd} data={rowData ?? undefined} />
            <DeleteStaff open={openDelete} handleClose={handleCloseDelete} id={rowData?._id || ''} />
            <WorkingShiftChanger open={openWorkingShift} handleClose={handleCloseWorkingShift} id={rowData?._id || ''} currentStatus={rowData?.workShift} />
            <ChangeAvailability open={openStatusChange} handleClose={handleCloseAvailabilityModal} id={rowData?._id || ''} currentStatus={rowData?.availabilityStatus} />

            <Box sx={{ width: '100%', minWidth: 0 }}>
                <Stack direction="row" alignItems="center" mb={3} justifyContent="space-between">
                    <Typography variant="h6">Staff Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Staff
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
