// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//     Stack,
//     Button,
//     Container,
//     Typography,
//     Card,
//     IconButton,
//     MenuItem,
//     Popover
// } from '@mui/material';
// import { Add, Delete, MoreVert, Edit } from '@mui/icons-material';
// import { DataGrid } from '@mui/x-data-grid';
// import TableStyle from '@/components/ui/table-style';
// import AddCourse from '@/components/course/addCourse';
// import DeleteCourse from '@/components/course/deleteCourse';
// import { getAllCourses } from '@/services/courseService';
// import { GridRenderCellParams } from '@mui/x-data-grid';

// interface Course {
//     _id: string;
//     name: string;
//     courseNumber: string;
//     holes: number;
//     location: string;
// }



// export default function RentalSalesReport() {
//     const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
//     const [open, setOpen] = useState(false);
//     const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
//     const [rowData, setRowData] = useState<Course | null>(null);

//     const [openDelete, setOpenDelete] = useState(false);
//     const [courses, setCourses] = useState<Course[]>([]);

//     const paginatedRows = courses.slice(
//         paginationModel.page * paginationModel.pageSize,
//         (paginationModel.page + 1) * paginationModel.pageSize
//     );

//     const rows = paginatedRows.map((row, index) => ({
//         ...row,
//         sNo: paginationModel.page * paginationModel.pageSize + index + 1,
//     }));


//     const columns = [
//         {
//             field: 'sNo',
//             headerName: 'S.No',
//             width: 80,
//             sortable: false,
//         },
//         { field: 'name', headerName: 'Course Name', flex: 1 },
//         { field: 'courseNumber', headerName: 'Course No.', flex: 0.7 },
//         { field: 'holes', headerName: 'No. of Holes', flex: 0.7 },
//         { field: 'capacity', headerName: 'Capacity', flex: 0.7 },
//         { field: 'location', headerName: 'Location', flex: 1 },
//         {
//             field: 'action',
//             headerName: 'Action',
//             width: 80,
//             sortable: false,
//             renderCell: (params: GridRenderCellParams<Course>) => {
//                 return (
//                     <>
//                         <IconButton onClick={(e) => handleClick(e, params.row)}>
//                             <MoreVert fontSize="small" />
//                         </IconButton>
//                         <Popover
//                             open={Boolean(anchorEl) && rowData?._id === params.row._id}
//                             anchorEl={anchorEl}
//                             onClose={handleClosePopover}
//                             anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//                         >
//                             <MenuItem onClick={() => handleOpenEdit(params.row)}>
//                                 <Edit fontSize="small" style={{ marginRight: 8 }} /> Edit
//                             </MenuItem>
//                             <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
//                                 <Delete fontSize="small" style={{ marginRight: 8 }} /> Delete
//                             </MenuItem>
//                         </Popover>
//                     </>
//                 );
//             }
//         }
//     ];
//     const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: Course) => {
//         setAnchorEl(event.currentTarget);
//         setRowData(row);
//     };

//     const handleClosePopover = () => {
//         setAnchorEl(null);
//     };

//     const handleOpenEdit = (row: Course) => {
//         setRowData(row);
//         setOpen(true);
//         handleClosePopover();
//     };

//     const handleOpenAdd = () => {
//         setRowData(null);
//         setOpen(true);
//     };

//     const handleCloseAdd = () => {
//         setOpen(false);
//         setRowData(null);
//     };

//     const handleDelete = () => {
//         setOpenDelete(true);
//     };

//     const handleCloseDelete = () => {
//         setOpenDelete(false);
//         setRowData(null);
//         handleClosePopover();
//     };
//     const fetchCourses = async () => {
//         try {
//             const response = await getAllCourses() as Course[];
//             setCourses(response);
//         } catch (error) {
//             console.error('Error fetching courses:', error);
//         }
//     };

//     useEffect(() => {
//         fetchCourses();
//     }, [open, openDelete]);

//     return (
//         <>
//             <Container>
//                 <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
//                     <Typography variant="h6">Sales Report of Rentals Products</Typography>
//                     <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
//                         New Course
//                     </Button>
//                 </Stack>

//                 <TableStyle>
//                     <Card sx={{height: '400px'}}>
//                         <DataGrid
//                             rows={rows}
//                             columns={columns}
//                             pagination
//                             paginationModel={paginationModel}
//                             onPaginationModelChange={setPaginationModel}
//                             pageSizeOptions={[5, 10]}
//                             getRowId={(row) => row?._id}
//                             sx={{
//                                 border: 0,
//                                 '& .MuiDataGrid-row': {
//                                     borderBottom: '1px solid #eee',
//                                 },
//                                 '& .MuiDataGrid-columnHeaders': {
//                                     backgroundColor: '#fafafa',
//                                     fontWeight: 'bold',
//                                 },
//                             }}
//                         />
//                     </Card>
//                 </TableStyle>
//             </Container>
//         </>
//     );
// }


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
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
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
        { field: 'sNo', headerName: 'S.No', width: 80 },
        { field: 'productName', headerName: 'Product Name', flex: 1 },
        { field: 'category', headerName: 'Category', flex: 1 },
        { field: 'totalQuantity', headerName: 'Quantity', flex: 0.6 },
        { field: 'totalRevenue', headerName: 'Total Revenue', flex: 0.8 },
        { field: 'netRevenue', headerName: 'Net Revenue', flex: 0.8 },
    ];

    // ---------------- MONTHLY COLUMNS ----------------
    const monthlyColumns = [
        { field: 'sNo', headerName: 'S.No', width: 80 },
        { field: 'month', headerName: 'Month', flex: 1 },
        { field: 'totalRevenue', headerName: 'Total Revenue', flex: 1 },
        { field: 'totalDiscount', headerName: 'Total Discount', flex: 1 },
        { field: 'netRevenue', headerName: 'Net Revenue', flex: 1 },
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

    const dailyRows = addSerialNumbers(dailyData);
    const monthlyRows = addSerialNumbers(monthlyData);

    return (
        <Container>
            <Stack direction="row" alignItems="center" mb={3} justifyContent="space-between">
                <Typography variant="h6">Sales Report of Rental Products</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ textTransform: 'none' }}
                    onClick={() => alert('Add new item (optional)')}
                >
                    New Entry
                </Button>
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
                    <Card sx={{ height: '400px' }}>
                        <DataGrid
                            rows={dailyRows}
                            columns={dailyColumns}
                            pagination
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[5, 10]}
                            getRowId={(row) => row?._id}
                            sx={{
                                border: 0,
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
                    <Card sx={{ height: '400px' }}>
                        <DataGrid
                            rows={monthlyRows}
                            columns={monthlyColumns}
                            pagination
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[5, 10]}
                            //getRowId={(row) => row?._id}
                            sx={{
                                border: 0,
                                '& .MuiDataGrid-row': { borderBottom: '1px solid #eee' },
                                '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fafafa', fontWeight: 'bold' },
                            }}
                        />
                    </Card>
                </TableStyle>
            )}
        </Container>
    );
}
