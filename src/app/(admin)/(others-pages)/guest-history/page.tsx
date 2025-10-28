'use client';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Container,
    Typography,
    Card,
    Box,
    Chip,
    IconButton,
    Popover,
    MenuItem
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import { getAllGuest } from '@/services/guestService';
import moment from 'moment';
import { getAllCustomer } from '@/services/customerService';
import { getBooking } from '@/services/bookingService';
import { MoreVert, Visibility } from '@mui/icons-material';
import Link from 'next/link';

interface Guest {
    _id: string;
    name: string;
    email: string;
    phone: string;
    course?: { name: string };
    groupSize: number;
    dateTime: string;
    amount: number;
    paymentMode: string;
    caddyCart: boolean;
    customerId: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        startDate: string;
    };
    bookingStatus: 'pending' | 'confirmed' | 'completed' | 'canceled';
    status: 'ACTIVE' | 'INACTIVE';
    isDeleted?: boolean;
}

export default function GuestHistoryManagement() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [guests, setGuests] = useState<Guest[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState<Guest | undefined>(undefined);

    const paginatedRows = guests.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row: Guest, index: number) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    }));

    const handleClick = (event: React.MouseEvent<HTMLElement>, row: Guest) => {
        setAnchorEl(event.currentTarget);
        setRowData(row);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 80 },
        {
            field: 'name', headerName: 'Name', flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                params.row.customerId?.name

            ),
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2">{params.row.customerId.email}</Typography>
                    <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                        {params.row.customerId.phone}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'startDate',
            headerName: 'Booking Date',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                params.row.customerId.startDate ? moment(params.row.customerId.startDate).format('DD MMM YYYY') : 'N/A'
            ),
        },

        {
            field: 'amount',
            headerName: 'Payment Amount',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                `Rs ${params.row.amount}/-`
            ),
        },

        {
            field: 'paymentMode',
            headerName: 'Payment Mode',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                params.row.paymentMode
            ),
        },
        {
            field: 'bookingStatus',
            headerName: 'Booking Status',
            flex: 1,
            width: 100,
            renderCell: (params) => {
                const status = params.value;
                const statusColorMap = {
                    pending: 'warning',
                    confirmed: 'info',
                    completed: 'success',
                    canceled: 'error',
                };

                const chipColor = statusColorMap[status] || 'default';

                // Optional: Capitalize the label
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
            width: 100,
            sortable: false,
            renderCell: (params: { row: Guest }) => (
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
                        {/* <MenuItem onClick={() => handleOpenEdit(params.row)}>
                            <Edit fontSize="small" style={{ marginRight: 8 }} /> Edit
                        </MenuItem> */}
                        <MenuItem
                            component={Link}
                            href={params?.row?._id ? `/guest-bookings/${params.row._id}` : "#"}
                            sx={{ color: "blue" }}
                        >
                            <Visibility fontSize="small" style={{ marginRight: 8 }} /> View
                        </MenuItem>
                    </Popover>
                </>
            )
        }
    ];

    const fetchGuestData = async () => {
        try {
            const response = await getBooking() as unknown as Guest[];
            const filterData = response?.filter((member: Guest) => member?.customerId?.role === "guest");
            setGuests(filterData as Guest[]);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    useEffect(() => {
        fetchGuestData();
    }, []);



    return (
        <>
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Guest History Management</Typography>
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
                            getRowId={(row: Guest & { sNo: number }) => row._id}
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
