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
    Menu,
    MenuItem,
    Popover
} from '@mui/material';
import { Add, Delete, MoreVert, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import AddPlans from '@/components/membership-plans/addPlan';
import DeletePlan from '@/components/membership-plans/deletePlan';
import { getAllPlan } from '@/services/plansService';

const defaultImage = 'https://via.placeholder.com/40';

export default function MembershipPlans() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [rowData, setRowData] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [plans, setPlans] = useState([]);
   
    const paginatedRows = plans.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    }));

    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 80 },
        {
            field: 'planImage',
            headerName: 'Image',
            width: 80,
            sortable: false,
            renderCell: (params) => {
                const imgSrc = params.row.planImage
                    ? `${process.env.NEXT_PUBLIC_API_IMG_URL}${params.row.planImage}`
                    : defaultImage;
                return (
                    <img
                        src={imgSrc}
                        alt={params.row.title}
                        style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }}
                    />
                );
            },
        },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'description', headerName: 'Description', flex: 1.5 },
        { field: 'price', headerName: 'Price', flex: 1 },
        { field: 'numberOfDays', headerName: 'Duration (In Days)', flex: 1 },
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

    const fetchPlans = async () => {
        try {
            const response = await getAllPlan();
            setPlans(response);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [open, openDelete]);

    return (
        <>
            <AddPlans open={open} handleClose={handleCloseAdd} data={rowData} />
            <DeletePlan open={openDelete} handleClose={handleCloseDelete} id={rowData?._id} />
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Membership Plan Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Plan
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
