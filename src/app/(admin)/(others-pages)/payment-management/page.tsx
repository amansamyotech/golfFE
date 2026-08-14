'use client';
import { sortLatestFirst } from '@/utils/tableConfig';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Button,
    Typography,
    Card,
    IconButton,
    MenuItem,
    Popover,
    Chip,
    Box
} from '@mui/material';
import { Add, Delete, MoreVert, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import AddPlans from '@/components/membership-plans/addPlan';
import DeletePlan from '@/components/membership-plans/deletePlan';
import { getAllPlan } from '@/services/plansService';
import Image from 'next/image';
import AddPayment from '@/components/payment/addPayment';
import { getAllPayments } from '@/services/paymentService';
import { render } from '@fullcalendar/core/preact.js';
import { flex } from '@mui/system';
import Link from 'next/link';

interface Plan {
    _id: string;
    planImage?: string;
    title: string;
    description: string;
    price: number;
    numberOfDays: number;
}

const defaultImage = 'https://via.placeholder.com/40';

export default function Payment() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [rowData, setRowData] = useState<Plan | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [payment, setPaymentData] = useState<any[]>([]);


    const rows = sortLatestFirst(payment).map((row, index) => ({
        ...row,
        sNo: index + 1,
    }));


    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 70 },
        {
            field: 'name', headerName: 'Name', flex: 1, minWidth: 130, renderCell: (params) => (
                <Typography variant="body2">{params.row.customerId?.name}</Typography>
            )
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1.5,
            minWidth: 180,
            renderCell: (params) => (
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2">{params.row.customerId?.email}</Typography>
                    <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                        {params.row.customerId?.phone}
                    </Typography>
                </Box>
            ),
        },

        {
            field: 'role', flex: 1, minWidth: 100, headerName: 'Role',
            renderCell: (params) => (
                <Typography variant="body2">{params.row.customerId?.role}</Typography>
            )
        },
        {
            field: 'totalAmount',
            flex: 1,
            minWidth: 120,
            headerName: 'Total Amount',
            renderCell: (params) => (
                `$${params.row.totalAmount ? params.row.totalAmount : '--'}`
            ),
        },
        {
            field: 'discount',
            headerName: 'Discount',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => (
                `${params.row.discount ? params.row.discount : '--'}%`
            ),
        },
        {
            field: 'paidAmount',
            headerName: 'Paid Amount',
            flex: 1,
            minWidth: 110,
            renderCell: (params) => (
                `$${params.row.paidAmount ? params.row.paidAmount : '--'}`
            ),
        },
        {
            field: 'paymentStatus',
            headerName: 'Payment Status',
            flex: 1,
            minWidth: 130,
            renderCell: (params) => {
                const status = params.row.bookingId?.paymentStatus;
                const statusColorMap = {
                    pending: 'error',
                    partial: 'warning',
                    paid: 'success',
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
        //     field: 'paymentAction',
        //     headerName: 'Make Payment',
        //     width: 120,
        //     sortable: false,
        //     renderCell: (params) => {
        //         return (
        //             <Button

        //                 variant="contained"
        //                 color='success'
        //                 size="small"
        //                 style={{ textTransform: 'none', width: '100%' }}


        //             >
        //                 Generate Bill
        //             </Button>
        //         );
        //     },
        // },

        {
            field: 'paymentAction',
            headerName: 'Make Payment',
            width: 150,
            sortable: false,
            renderCell: (params) => {
                const id = params.row._id; // Payment ID from row
                return (
                    <Link href={`/payment-management/${id}`} style={{ width: '100%', textDecoration: 'none' }}>
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            fullWidth
                            style={{ textTransform: 'none' }}
                        >
                            Generate Bill
                        </Button>
                    </Link>
                );
            },
        }


        // {
        //     field: 'paymentAction',
        //     headerName: 'Payment Action',
        //     width: 120,
        //     sortable: false,
        //     renderCell: (params) => {
        //         return (
        //             <Button
        //                 variant="contained"
        //                 color='success'
        //                 size="small"
        //                 style={{ textTransform: 'none' }}
        //                 onClick={() => handleOpenAdd(params.row)}
        //                 disabled={params.row.paymentStatus === 'paid'}
        //             >
        //                 Pay Now
        //             </Button>
        //         );
        //     },
        // },
    ];

    const handleClick = (event: React.MouseEvent<HTMLElement>, row: Plan) => {
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

    const handleOpenAdd = (row: any) => {
        setRowData(row);
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

    const fetchPaymentData = async () => {
        try {
            const response = await getAllPayments();
            setPaymentData(response as Plan[]);
        } catch (error) {
            console.error('Error fetching payment data:', error);
        }
    };


    useEffect(() => {
        fetchPaymentData();
    }, [open, openDelete]);

    return (
        <>
            <AddPayment open={open} handleClose={handleCloseAdd} data={rowData ?? undefined} />
            <DeletePlan open={openDelete} handleClose={handleCloseDelete} id={rowData?._id || ''} />
            <Box sx={{ width: '100%', minWidth: 0 }}>
                <Stack direction="row" alignItems="center" mb={3} justifyContent="space-between">
                    <Typography variant="h6">Billing & Payments Management</Typography>

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
                            // checkboxSelection
                            getRowId={(row) => row._id || ''}
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
