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
import {
    Add, Edit, Delete, MoreVert, Visibility, Undo,
    KeyboardReturn,
    Cancel,
} from '@mui/icons-material';

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
import AddProduct from '@/components/pro-shop/addProduct';
import { getAllProducts } from '@/services/productService';
import DeleteProduct from '@/components/pro-shop/deleteProduct';
import AddRental from '@/components/pro-shop-rental/addRental';
import { getAllRentals } from '@/services/rentalProductService';
import ConfirmReturnDialog from '@/components/pro-shop-rental/returnRental';
import CancelRental from '@/components/pro-shop-rental/cancelRental';

export default function ProductShopRental() {
    const [open, setOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [courses, setCourses] = useState([]);
    const [rentalData, setRentalData] = useState([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [rowData, setRowData] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openReturn, setOpenReturn] = useState(false);
    const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);

    const handleOpenAdd = () => {
        setOpen(true);
    };

    const handleCloseAdd = () => {
        setOpen(false);
        setRowData(null);
    };

    const handleOpenReturn = () => {
        setOpenReturn(true);
    };

    const handleCloseReturn = () => {
        setOpenReturn(false);
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

    const paginatedRows = rentalData.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    }));

    const columns = [
        { field: "sNo", headerName: "S.No", width: 80, sortable: false },

        {
            field: "productName",
            headerName: "Product Name",
            flex: 1.5,
            renderCell: (params) => params.row.productId?.name || "-",
        },
        {
            field: "customerName",
            headerName: "Customer Name",
            flex: 1.5,
            renderCell: (params) => params.row.customerId?.name || "-",
        },
        {
            field: "rentalRate",
            headerName: "Rate (₹/day)",
            flex: 1,
            renderCell: (params) =>
                `₹${params.row.productId?.rentalRate?.toLocaleString() || "0"}`,
        },
        {
            field: "quantity",
            headerName: "Qty",
            flex: 0.6,
            renderCell: (params) => params.row.quantity || "-",
        },
        {
            field: "totalAmount",
            headerName: "Total (₹)",
            flex: 1,
            renderCell: (params) =>
                `₹${params.row.totalAmount?.toLocaleString() || "0"}`,
        },
        {
            field: "rentedDate",
            headerName: "Rented On",
            flex: 1,
            renderCell: (params) =>
                new Date(params.row.rentedDate).toLocaleDateString() || "-",
        },
        {
            field: "returnDate",
            headerName: "Return On",
            flex: 1,
            renderCell: (params) =>
                new Date(params.row.returnDate).toLocaleDateString() || "-",
        },


        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            width: 100,
            renderCell: (params) => {
                const status = params.value;

                const statusColorMap = {
                    rented: 'info',
                    returned: 'success',
                    cancelled: 'error',
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
            field: "action",
            headerName: "Action",
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton onClick={(e) => handleClick(e, params.row)}>
                        <MoreVert fontSize="small" />
                    </IconButton>
                    <Popover
                        open={Boolean(anchorEl) && rowData?._id === params.row._id}
                        anchorEl={anchorEl}
                        onClose={handleClosePopover}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    >
                        <MenuItem onClick={handleOpenEdit}>
                            <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
                        </MenuItem>
                        {/* <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
                            <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                        </MenuItem> */}
                        <MenuItem onClick={handleOpenReturn}>
                            <Undo fontSize="small" sx={{ mr: 1 }} /> Return
                        </MenuItem>
                        <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
                            <Cancel fontSize="small" sx={{ mr: 1 }} /> Cancle
                        </MenuItem>
                    </Popover>
                </>
            ),
        },
    ];

    const fetchRentalsData = async () => {
        try {
            const response = await getAllRentals() as any[];
            setRentalData(response);
        } catch (error) {
            console.error('Error fetching tournament:', error);
        }
    };

    useEffect(() => {
        fetchRentalsData();
    }, [open, openDelete, openReturn]);

    return (
        <>
            <ConfirmReturnDialog open={openReturn} handleClose={handleCloseReturn} data={rowData} />
            <AddRental open={open} handleClose={handleCloseAdd} data={rowData} />
            <CancelRental open={openDelete} handleClose={handleCloseDelete} id={rowData?._id || ''} />
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Product Rental Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Rental
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
