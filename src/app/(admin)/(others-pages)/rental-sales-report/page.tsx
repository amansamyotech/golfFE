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
    Tabs,
    Tab,
    Box,
} from '@mui/material';
import { Add, Delete, MoreVert, Edit } from '@mui/icons-material';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import AddCourse from '@/components/course/addCourse';
import DeleteCourse from '@/components/course/deleteCourse';
import { getAllCourses } from '@/services/courseService';
import { dailySalesRentalReport, monthlySalesRentalReport } from '@/services/reportService';


interface DailyReport {
    _id: string;
    productName: string;
    date: string;
    quantity: number;
    totalAmount: number;
}

interface MonthlyReport {
    _id: string;
    month: string;
    totalSales: number;
    totalUnits: number;
    avgRentalPrice: number;
}

export default function RentalSalesReport() {
    const [tabValue, setTabValue] = useState<'daily' | 'monthly'>('daily');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [rowData, setRowData] = useState<any | null>(null);
    const [dailyData, setDailyData] = useState<DailyReport[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyReport[]>([]);
    const [openDelete, setOpenDelete] = useState(false);

    // Fetch Daily
    const fetchDailyReport = async () => {
        try {
            const response = await dailySalesRentalReport() as { details: DailyReport[] };
            setDailyData(response?.details || []);
        } catch (error) {
            console.error('Error fetching daily data:', error);
        }
    };

    // Fetch Monthly
    const fetchMonthlyReport = async () => {
        try {
            const response = await monthlySalesRentalReport() as any[];
            setMonthlyData(response || []);
        } catch (error) {
            console.error('Error fetching monthly data:', error);
        }
    };

    useEffect(() => {
        fetchDailyReport();
        fetchMonthlyReport();
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: any) => {
        setAnchorEl(event.currentTarget);
        setRowData(row);
    };

    const handleClosePopover = () => setAnchorEl(null);
    const handleDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setRowData(null);
        handleClosePopover();
    };

    // ---------------- DAILY COLUMNS ----------------
    const dailyColumns = [
        { field: 'sNo', headerName: 'S.No', width: 70 },
        { field: 'productName', headerName: 'Product Name', flex: 1, minWidth: 150 },
        { field: 'category', headerName: 'Category', flex: 1, minWidth: 110 },
        { field: 'totalQuantity', headerName: 'Quantity', flex: 1, minWidth: 90 },
        { field: 'totalRevenue', headerName: 'Total Revenue', flex: 1, minWidth: 120 },
        { field: 'netRevenue', headerName: 'Net Revenue', flex: 1, minWidth: 110 },
    ];

    // ---------------- MONTHLY COLUMNS ----------------
    const monthlyColumns = [
        { field: 'sNo', headerName: 'S.No', width: 70 },
        { field: 'month', headerName: 'Month', flex: 1, minWidth: 120 },
        { field: 'totalRevenue', headerName: 'Total Revenue', flex: 1, minWidth: 130 },
        { field: 'totalDiscount', headerName: 'Total Discount', flex: 1, minWidth: 130 },
        { field: 'netRevenue', headerName: 'Net Revenue', flex: 1, minWidth: 120 },
    ];

    // Add Serial No. Field
    // const addSerialNumbers = (data: any[]) =>
    //     data.map((row, index) => ({
    //         ...row,
    //         sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    //     }));

    const addSerialNumbers = (data: any[]) =>
        data.map((row, index) => ({
            id: row._id || index + 1, 
            ...row,
            sNo: paginationModel.page * paginationModel.pageSize + index + 1,
        }));

    const dailyRows = addSerialNumbers(sortLatestFirst(dailyData));
    const monthlyRows = addSerialNumbers(sortLatestFirst(monthlyData));

    return (
        <Box sx={{ width: '100%', minWidth: 0 }}>
            <Stack direction="row" alignItems="center" mb={3} justifyContent="space-between">
                <Typography variant="h6">Sales Report of Rental Products</Typography>
                {/* <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ textTransform: 'none' }}
                    onClick={() => alert('Add new item (optional)')}
                >
                    New Entry
                </Button> */}
            </Stack>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="Daily Report" value="daily" />
                    <Tab label="Monthly Report" value="monthly" />
                </Tabs>
            </Box>

            {/* Daily Report Table */}
            {tabValue === 'daily' && (
                <TableStyle>
                    <Card sx={{ width: '100%' }}>
                        <DataGrid
                            rows={dailyRows}
                            columns={dailyColumns}
                            pagination
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[10, 20, 50, 100]}
                            getRowId={(row) => row?._id}
                            sx={{
                                border: 0,
                                width: '100%',
                                '& .MuiDataGrid-row': { borderBottom: '1px solid #eee' },
                                '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fafafa', fontWeight: 'bold' },
                            }}
                        />
                    </Card>
                </TableStyle>
            )}

            {/* Monthly Report Table */}
            {tabValue === 'monthly' && (
                <TableStyle>
                    <Card sx={{ width: '100%' }}>
                        <DataGrid
                            rows={monthlyRows}
                            columns={monthlyColumns}
                            pagination
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[10, 20, 50, 100]}
                            sx={{
                                border: 0,
                                width: '100%',
                                '& .MuiDataGrid-row': { borderBottom: '1px solid #eee' },
                                '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fafafa', fontWeight: 'bold' },
                            }}
                        />
                    </Card>
                </TableStyle>
            )}
        </Box>
    );
}
