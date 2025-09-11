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
import { Add, Delete, MoreVert, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import AddMember from '@/components/members-management/addMember';
import DeleteMember from '@/components/members-management/deleteMember';
import { getAllMember } from '@/services/memberService';
import MemberDetailDialog from '@/components/members-management/MemberDetailDialog';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Member() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [rowData, setRowData] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [members, setMembers] = useState([]);
    const [detailOpen, setDetailOpen] = useState(false);

    const paginatedRows = members.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    }));



    const handleViewMoreClose = () => {
        setRowData(null);
        setDetailOpen(false);
    };

    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 80 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        {
            field: 'plan', headerName: 'Plan', width: 120,
            renderCell: (params) => (
                <Typography variant="body2" mt={2}>
                    {params.row.plan?.title || 'N/A'}
                </Typography>
            ),
        },
        {
            field: 'course',
            headerName: 'course',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" mt={2}>
                    {params.row.course?.name || 'N/A'}
                </Typography>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => {
                const isActive =
                    typeof params.value === 'boolean'
                        ? params.value
                        : params.value === 'Active';
                const label = isActive ? 'Active' : 'Inactive';
                return (
                    <Chip
                        label={label}
                        sx={{
                            color: isActive ? '#79dbfb' : '#ff6a67',
                            backgroundColor: isActive ? '#e5f8fe' : '#ffeae9',
                            minWidth: '80px',
                            borderRadius: '12px',
                        }}
                    />
                );
            },
        },
        {
            field: 'more',
            headerName: 'More',
            width: 130,
            sortable: false,
            renderCell: (params) => (
                <Link href={`/members-management/${params.row._id}`} passHref>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: '#f0f0f0',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                            }}

                        >
                            <Typography color="grey" fontSize="0.8rem" fontWeight={500}>
                                View More
                            </Typography>
                        </Box>
                    </Box>
                </Link>
            ),
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
                            <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
                                <Delete fontSize="small" style={{ marginRight: 8 }} /> Delete
                            </MenuItem>
                        </Popover>
                    </>
                );
            }
        }
    ];

    const handleClick = (event, row) => {
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
            const response = await getAllMember();
            setMembers(response);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [open, openDelete]);

    return (
        <>
            <AddMember open={open} handleClose={handleCloseAdd} data={rowData} />
            <DeleteMember open={openDelete} handleClose={handleCloseDelete} id={rowData?._id} />
            <MemberDetailDialog
                open={detailOpen}
                handleClose={handleViewMoreClose}
                member={rowData}
            />
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
