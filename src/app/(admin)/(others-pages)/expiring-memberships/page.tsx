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
import { getAllMember } from '@/services/memberService';
import moment from 'moment';

export default function ExpiringMemberships() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [open, setOpen] = useState(false);
    const [members, setMembers] = useState([]);

    const paginatedRows = members.slice(
        paginationModel.page * paginationModel.pageSize,
        (paginationModel.page + 1) * paginationModel.pageSize
    );

    const rows = paginatedRows.map((row, index) => ({
        ...row,
        sNo: paginationModel.page * paginationModel.pageSize + index + 1,
    }));

    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 80 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        {
            field: 'plan', headerName: 'Plan Name', flex: 1, renderCell: (params) => (
                <Typography variant="body2" mt={2}>
                    {params.row.plan?.title || 'N/A'}
                </Typography>
            ),
        },
        { field: 'startDate', headerName: 'Start Date', flex: 1, renderCell: (params) => moment(params.value).format('YYYY-MM-DD') },
        { field: 'endDate', headerName: 'End Date', flex: 1, renderCell: (params) => moment(params.value).format('YYYY-MM-DD') },
        {
            field: 'more',
            headerName: 'More',
            width: 130,
            sortable: false,
            renderCell: () => (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: '#f0f0f0',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        <Typography color="grey" fontSize="0.8rem" fontWeight={500}>
                            View More
                        </Typography>
                    </Box>
                </Box>
            ),
        }
    ];

    const fetchMembers = async () => {
        // try {
        //     const response = await getAllMember();
        //     setMembers(response);
        // } catch (error) {
        //     console.error('Error fetching members of expring plan :', error);
        // }
        try {
            const response = await getAllMember();
            const currentDate = new Date();
            const expiredMembers = response.filter(member => {
                const endDate = new Date(member.endDate);
                return endDate < currentDate;
            });

            setMembers(expiredMembers);
        } catch (error) {
            console.error('Error fetching members with expired plan:', error);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);


    return (
        <>

            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
                    <Typography variant="h6">Expiring Memberships</Typography>
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
