'use client';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Button,
    Container,
    Typography,
    Card,
    Box,
    Chip,
    IconButton,
    MenuItem,
    Popover
} from '@mui/material';
import { Add, Delete, MoreVert, Edit, Visibility } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import AddMember from '@/components/members-management/addMember';
import DeleteMember from '@/components/members-management/deleteMember';
import { getAllMember } from '@/services/memberService';
import { getAllCustomer } from '@/services/customerService';
import Link from 'next/link';
import { GridRenderCellParams } from '@mui/x-data-grid';
import moment from 'moment';
interface Member {
    _id: string;
    name: string;
    email: string;
    plan?: { _id: string; title: string } | null;
    course?: { _id: string; name: string } | null;
    status: boolean | string;
    role?: string;
}

// Define MemberData interface (copied from AddMember for mapping)
interface MemberData {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    dob?: string;
    gender?: string;
    image?: string;
    plan?: { _id: string };
    startDate?: string;
    teeTime?: string;
    course?: { _id: string };
    profileType?: string;
}

export default function Member() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState<Member | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);

    const paginatedRows = members.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    }));

    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 80 },
        { field: 'name', headerName: 'Name', flex: 1 },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1.5,
            renderCell: (params: GridRenderCellParams) => (
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2">{params.row.email}</Typography>
                    <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                        {params.row.phone}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                params.row.startDate ? moment(params.row.startDate).format('DD MMM YYYY') : 'N/A'
            ),
        },
        {
            field: 'plan', headerName: 'Plan', width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" mt={2}>
                    {params.row.plan?.title || 'N/A'}
                </Typography>
            ),
        },
        {
            field: 'profileType', headerName: 'Profile Type', width: 120,
            renderCell: (params: any) => {
                const value = params.value || '';
                const formattedValue =
                    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                return formattedValue;
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params: GridRenderCellParams) => {
                const isActive =
                    typeof params.value === 'boolean'
                        ? params.value
                        : params.value === 'ACTIVE';

                const label = isActive ? 'ACTIVE' : 'INACTIVE';

                return (
                    <Chip
                        label={label}
                        size="small"
                        variant="outlined"
                        sx={{
                            color: isActive ? 'success.main' : 'error.main',
                            borderColor: isActive ? 'success.main' : 'error.main',
                            width: '100%',
                            borderRadius: '5px',
                            fontSize: '12px',
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
            renderCell: (params: GridRenderCellParams<Member>) => {
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
                                href={params?.row?._id ? `/members-management/${params.row._id}` : "#"}
                                sx={{ color: "blue" }}
                            >
                                <Visibility fontSize="small" style={{ marginRight: 8 }} /> View
                            </MenuItem>
                            {/* <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
                                <Delete fontSize="small" style={{ marginRight: 8 }} /> Delete
                            </MenuItem> */}
                        </Popover>
                    </>
                );
            }
        }
    ];



    const handleClick = (event: React.MouseEvent<HTMLElement>, row: Member) => {
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

    const fetchMembers = async () => {
        try {
            const response = await getAllCustomer() as unknown as Member[];
            const filterData = response?.filter((member: Member) => member?.role === "member")
            setMembers(filterData as Member[]);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [open, openDelete]);

    return (
        <>
            <AddMember open={open} handleClose={handleCloseAdd}
                // data={mapMemberToMemberData(rowData)} 
                data={rowData}
            />
            <DeleteMember open={openDelete} handleClose={handleCloseDelete} id={rowData?._id || ''} />
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Member Management</Typography>

                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Member
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
