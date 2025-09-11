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
} from '@mui/material';
import { Add, Delete, MoreVert, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import AddGuestBookings from '@/components/guest/addBooking';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { getAllGuest } from '@/services/guestService';
import moment from 'moment';

export default function GuestHistoryManagement() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [open, setOpen] = useState(false);
    const [guests, setGuestHistory] = useState([]);

    const paginatedRows = guests.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    }));

    const columns = [
        { field: 'sNo', headerName: 'S.No', flex: 0.5 },
        { field: 'name', headerName: 'Name', flex: 1.7 },
        {
            field: 'email',
            headerName: 'Email',
            flex: 2,
            renderCell: (params) => (
                <Box lineHeight={1.2} mt={1}>
                    <Typography variant="body2">{params.row.email}</Typography>
                    <Typography variant="caption" color="textSecondary">
                        {params.row.phone}
                    </Typography>
                </Box>
            )
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
        { field: 'groupSize', headerName: 'Group Size', flex: 1 },
        { field: 'dateTime', headerName: 'Date & Time', flex: 1.5, renderCell: (params) => moment(params.value).format('YYYY-MM-DD') },
        { field: 'amount', headerName: 'Amount', flex: 1, renderCell: (params) => `₹${params.value}` },
        { field: 'paymentMode', headerName: 'Payment Method', flex: 1 },
        {
            field: 'caddyCart',
            headerName: 'Caddy',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Assign' : 'Not Assign'}
                    color={params.value ? 'success' : 'warning'}
                    size="small"
                />
            )
        }
    ];

    const handleOpenAddMember = () => {
        setOpen(true);
    };

    const handleCloseAddMember = () => {
        setOpen(false);
    };

    const fetchGuestHistory = async () => {
        try {
            const response = await getAllGuest();
            setGuestHistory(response);
        } catch (error) {
            console.error('Error fetching guest history:', error);
        }
    };

    useEffect(() => {
        fetchGuestHistory();
    }, []);


    return (
        <>
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Guest History</Typography>
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
                            // checkboxSelection
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
