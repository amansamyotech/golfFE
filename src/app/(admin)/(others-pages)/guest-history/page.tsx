'use client';
import { sortLatestFirst } from '@/utils/tableConfig';

import React, { useState, useEffect } from 'react';
import {
    Stack,
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
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [guests, setGuests] = useState<Guest[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState<Guest | undefined>(undefined);

    const rows = sortLatestFirst(guests).map((row: Guest, index: number) => ({
        ...row,
        sNo: index + 1,
    }));

    const handleClick = (event: React.MouseEvent<HTMLElement>, row: Guest) => {
        setAnchorEl(event.currentTarget);
        setRowData(row);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 70 },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 140,
            renderCell: (params: GridRenderCellParams) => (
                <Link
                    href={`/guest-bookings/${params.row._id}`}
                    style={{
                        color: "#1976d2",
                        textDecoration: "underline",
                        cursor: "pointer"
                    }}
                >
                    {params?.row?.customerId?.name}
                </Link>
            ),
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            minWidth: 170,
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
            minWidth: 130,
            renderCell: (params: GridRenderCellParams) => (
                params.row.customerId.startDate ? moment(params.row.customerId.startDate).format('MMM DD, YYYY') : 'N/A'
            ),
        },

        {
            field: 'amount',
            headerName: 'Payment Amount',
            flex: 1,
            minWidth: 140,
            renderCell: (params: GridRenderCellParams) => (
                `$${params.row.customerId.totalAmount || 0}`
            ),
        },
        {
            field: 'bookingStatus',
            headerName: 'Booking Status',
            flex: 1,
            minWidth: 130,
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
                // const value = params.value;
                // const isActive = value == 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
                // const label = isActive ? 'ACTIVE' : 'INACTIVE';

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
        }

        // {
        //     field: 'action',
        //     headerName: 'Action',
        //     width: 100,
        //     sortable: false,
        //     renderCell: (params: { row: Guest }) => (
        //         <>
        //             <IconButton onClick={(e) => handleClick(e, params.row)}>
        //                 <MoreVert fontSize="small" />
        //             </IconButton>
        //             <Popover
        //                 open={Boolean(anchorEl) && rowData?._id === params.row._id}
        //                 anchorEl={anchorEl}
        //                 onClose={handleClosePopover}
        //                 anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        //             >
        //                 {/* <MenuItem onClick={() => handleOpenEdit(params.row)}>
        //                     <Edit fontSize="small" style={{ marginRight: 8 }} /> Edit
        //                 </MenuItem> */}
        //                 <MenuItem
        //                     component={Link}
        //                     href={params?.row?._id ? `/guest-bookings/${params.row._id}` : "#"}
        //                     sx={{ color: "blue" }}
        //                 >
        //                     <Visibility fontSize="small" style={{ marginRight: 8 }} /> View
        //                 </MenuItem>
        //             </Popover>
        //         </>
        //     )
        // }
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
            <Box sx={{ width: '100%', minWidth: 0 }}>
                <Stack direction="row" alignItems="center" mb={3} justifyContent="space-between">
                    <Typography variant="h6">Guest History Management</Typography>
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
                            getRowId={(row: Guest & { sNo: number }) => row._id}
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
