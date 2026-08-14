'use client';
import { sortLatestFirst } from '@/utils/tableConfig';

import React, { useState, useEffect } from 'react';
import {
    Stack,
    Typography,
    Card,
    Box,
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import TableStyle from '@/components/ui/table-style';
import { getAllMember } from '@/services/memberService';
import moment from 'moment';
import { GridRenderCellParams } from '@mui/x-data-grid';

interface Plan {
    _id: string;
    title: string;
}

interface Membership {
    _id: string;
    name: string;
    expiryDate: string;
    plan?: Plan;
}

interface Member {
    _id: string;
    name: string;
    endDate: string;
    plan?: Plan;

}

export default function ExpiringMemberships() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [members, setMembers] = useState<Member[]>([]);

    const rows: Membership[] = sortLatestFirst(members).map((member: Member, index) => ({
        sNo: index + 1,
        _id: member._id,
        name: member.name,
        expiryDate: member.endDate,
        plan: member.plan,
    }));

    const columns = [
        { field: 'sNo', headerName: 'S.No', width: 70 },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 140 },
        { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 180 },
        {
            field: 'plan', headerName: 'Plan Name', flex: 1, minWidth: 120, renderCell: (params: GridRenderCellParams<Membership>) => (
                <Typography variant="body2" mt={2}>
                    {params.row.plan?.title || 'N/A'}
                </Typography>
            ),
        },
        { field: 'startDate', headerName: 'Start Date', flex: 1, minWidth: 120, renderCell: (params: GridRenderCellParams<Membership>) => moment(params.value).format('MM/DD/YYYY') },
        { field: 'endDate', headerName: 'End Date', flex: 1, minWidth: 120, renderCell: (params: GridRenderCellParams<Membership>) => moment(params.value).format('MM/DD/YYYY') },
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
        try {
            // const response = await getAllMember();
            const response = await getAllMember() as Member[];
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
            <Box sx={{ width: '100%', minWidth: 0 }}>
                <Stack direction="row" alignItems="center" mb={3} justifyContent="space-between">
                    <Typography variant="h6">Expiring Memberships</Typography>
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
                            checkboxSelection
                            getRowId={(row) => row._id}
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
