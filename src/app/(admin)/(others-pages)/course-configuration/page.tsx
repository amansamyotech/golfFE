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
import AddCourse from '@/components/course/addCourse';
import DeleteCourse from '@/components/course/deleteCourse';
import { getAllCourses } from '@/services/courseService';

export default function Course() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [rowData, setRowData] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [courses, setCourses] = useState([]);

    const paginatedRows = courses.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    }));


    const columns = [
        {
            field: 'sNo',
            headerName: 'S.No',
            width: 80,
            sortable: false,
        },
        { field: 'name', headerName: 'Course Name', flex: 1 },
        { field: 'courseNumber', headerName: 'Course No.', flex: 0.7 },
        { field: 'holes', headerName: 'No. of Holes', flex: 0.7 },
        { field: 'location', headerName: 'Location', flex: 1 },
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
    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setRowData(row);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleOpenEdit = (row: any) => {
        console.log("Editing row:", row);

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
            const response = await getAllCourses();
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
            <DeleteCourse open={openDelete} handleClose={handleCloseDelete} id={rowData?._id} />
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Course Management</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ textTransform: 'none' }}>
                        New Course
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
