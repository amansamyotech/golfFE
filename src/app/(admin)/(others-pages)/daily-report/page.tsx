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
    Popover
} from '@mui/material';
import { Add, Delete, MoreVert, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import AddCourse from '@/components/course/addCourse';
import DeleteCourse from '@/components/course/deleteCourse';
import { getAllCourses } from '@/services/courseService';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { dailySalesReport } from '@/services/reportService';


interface Course {
    _id: string;
    name: string;
    courseNumber: string;
    holes: number;
    location: string;
}



export default function DailyReport() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [rowData, setRowData] = useState<Course | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [reportData, setReportData] = useState<any[]>([]);

    const paginatedRows = reportData.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    // const rows = paginatedRows.map((row, index) => ({
    //     ...row,
    //     sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    // }));

    const rows = paginatedRows.map((row, index) => ({
        id: paginationModel.page * paginationModel.pageSize + index + 1,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
        ...row,
    }));


    const columns = [
        {
            field: 'sNo',
            headerName: 'S.No',
            width: 80,
            sortable: false,
        },
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'totalSales', headerName: 'Total Sales', flex: 0.7 },
        { field: 'totalDiscount', headerName: 'Discount', flex: 0.7 },
        { field: 'totalTransactions', headerName: 'Total Transaction', flex: 0.7 },
        // {
        //     field: 'action',
        //     headerName: 'Action',
        //     width: 80,
        //     sortable: false,
        //     renderCell: (params: GridRenderCellParams<Course>) => {
        //         return (
        //             <>
        //                 <IconButton onClick={(e) => handleClick(e, params.row)}>
        //                     <MoreVert fontSize="small" />
        //                 </IconButton>
        //                 <Popover
        //                     open={Boolean(anchorEl) && rowData?._id === params.row._id}
        //                     anchorEl={anchorEl}
        //                     onClose={handleClosePopover}
        //                     anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        //                 >
        //                     <MenuItem onClick={() => handleOpenEdit(params.row)}>
        //                         <Edit fontSize="small" style={{ marginRight: 8 }} /> Edit
        //                     </MenuItem>
        //                     <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
        //                         <Delete fontSize="small" style={{ marginRight: 8 }} /> Delete
        //                     </MenuItem>
        //                 </Popover>
        //             </>
        //         );
        //     }
        // }
    ];
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: Course) => {
        setAnchorEl(event.currentTarget);
        setRowData(row);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleOpenEdit = (row: Course) => {
        setRowData(row);
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
    const fetchCourses = async () => {
        try {
            const response = await getAllCourses() as Course[];
            setCourses(response);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchDailyReport = async () => {
        try {
            const response = await dailySalesReport() as any[];
            setReportData(response);
        } catch (error) {
            console.error('Error fetching daily sales report:', error);
        }
    };



    useEffect(() => {
        // fetchCourses();
        fetchDailyReport();
    }, []);

    return (
        <>
            <AddCourse open={open} handleClose={handleCloseAdd} data={rowData} />
            <DeleteCourse open={openDelete} handleClose={handleCloseDelete} id={rowData?._id || ''} />
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Sales Report By Dates</Typography>

                    {/* Today's Date */}
                    <Typography variant="h6" color="text.secondary">
                        {new Date().toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Typography>
                </Stack>

                <TableStyle>
                    <Card sx={{ height: '400px' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pagination
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[5, 10]}
                            // getRowId={(row) => row?._id}
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
