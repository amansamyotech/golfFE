'use client';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Button,
    Container,
    Typography,
    Card,
    IconButton,
    MenuItem,
    Popover
} from '@mui/material';
import { Add, Delete, MoreVert, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import AddEmployee from '@/components/staff-management/addStaff';
import DeleteStaff from '@/components/staff-management/deleteStaff';
import { getAllStaff } from '@/services/staffService';
import moment from 'moment';
import Image from 'next/image';
import { GridColDef } from '@mui/x-data-grid';

interface StaffMember {
    _id: string;
    profileImg?: string;
    name: string;
    email: string;
    jobTitle: string;
    department: string;
    dateOfJoining: string;
    title: string;
}

const defaultImage = 'https://via.placeholder.com/40';

export default function StaffManagement() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState<StaffMember | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [staff, setStaffMembers] = useState<StaffMember[]>([]);

    const paginatedRows = staff.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    }));

    const columns: GridColDef[] = [
        { field: 'sNo', headerName: 'S.No', width: 80 },
        {
            field: 'profileImg',
            headerName: 'Image',
            width: 80,
            sortable: false,
            renderCell: (params: { row: StaffMember }) => {
                const imgSrc = params.row.profileImg
                    ? `${process.env.NEXT_PUBLIC_API_IMG_URL}${params.row.profileImg}`
                    : defaultImage;
                return (
                    // <img
                    //     src={imgSrc}
                    //     alt={params.row.title}
                    //     style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }}
                    // />
                    <Image
                        src={imgSrc}
                        alt={params.row.title}
                        width={40}
                        height={40}
                        style={{ borderRadius: 4, objectFit: 'cover' }}
                    />
                );
            },
        },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'jobTitle', headerName: 'Job Title', flex: 1 },
        { field: 'department', headerName: 'Department', flex: 1 },
        { field: 'dateOfJoining', headerName: 'Date Of Joining', flex: 1, renderCell: (params) => moment(params.value).format('YYYY-MM-DD') },
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

    const handleDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
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
    }, [open, openDelete]);



    return (
        <>
            <AddEmployee open={open} handleClose={handleCloseAdd} data={rowData ?? undefined} />
            <DeleteStaff open={openDelete} handleClose={handleCloseDelete} id={rowData?._id || ''} />
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Staff Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Staff
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
                            checkboxSelection
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
