'use client';
import { sortLatestFirst } from '@/utils/tableConfig';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Button,
    Box,
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

interface Course {
    _id: string;
    name: string;
    courseNumber: string;
    holes: number;
    location: string;
}



export default function Course() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [rowData, setRowData] = useState<Course | null>(null);

    const [openDelete, setOpenDelete] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);

    const rows = sortLatestFirst(courses).map((row, index) => ({
        ...row,
        sNo: index + 1,
    }));


    const columns = [
        {
            field: 'sNo',
            headerName: 'S.No',
            width: 80,
            sortable: false,
        },
        { field: 'name', headerName: 'Course Name', flex: 1, minWidth: 180 },
        { field: 'courseNumber', headerName: 'Course No.', width: 140 },
        { field: 'holes', headerName: 'Holes', width: 100 },
        { field: 'capacity', headerName: 'Capacity', width: 110 },
        { field: 'location', headerName: 'Location', flex: 1, minWidth: 160 },
        {
            field: 'action',
            headerName: 'Action',
            width: 90,
            sortable: false,
            renderCell: (params: GridRenderCellParams<Course>) => {
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
                            <MenuItem onClick={() => handleOpenEdit(params.row)}>
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

    useEffect(() => {
        fetchCourses();
    }, [open, openDelete]);

    return (
        <>
            <AddCourse open={open} handleClose={handleCloseAdd} data={rowData} />
            <DeleteCourse open={openDelete} handleClose={handleCloseDelete} id={rowData?._id || ''} />
            <Box sx={{ width: '100%', minWidth: 0 }}>
                <Stack direction="row" alignItems="center" mb={3} justifyContent="space-between">
                    <Typography variant="h6">Course Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Course
                    </Button>
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
                            getRowId={(row) => row?._id}
                            disableRowSelectionOnClick
                            sx={{
                                border: 0,
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
