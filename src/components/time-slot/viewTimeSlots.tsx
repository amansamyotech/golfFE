

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Chip, CircularProgress } from '@mui/material';
import { getAllIndividualSlots } from '@/services/timeslotService';
import moment from 'moment'; // Ensure moment is installed: npm install moment

const SlotManagementPage = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                setLoading(true);
                const response = await getAllIndividualSlots();
                setSlots(response || []);
            } catch (err) {
                setError('Failed to fetch slots');
                console.error('Error fetching slots:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, []);

    // Group slots by month and then by date within each month
    const groupedByMonth = slots.reduce((acc, slot) => {
        if (!slot) return acc;

        const startDate = moment(slot.start, 'YYYY-MM-DD HH:mm');
        const monthYear = startDate.format('MMMM YYYY');
        const date = startDate.format('DD-MM-YYYY');
        const startTime = startDate.format('h:mm A'); // 12-hour format with AM/PM
        const endDate = moment(slot.end, 'YYYY-MM-DD HH:mm');
        const endTime = endDate.format('h:mm A');

        if (!acc[monthYear]) {
            acc[monthYear] = {};
        }
        if (!acc[monthYear][date]) {
            acc[monthYear][date] = [];
        }
        acc[monthYear][date].push({ startTime, endTime, status: slot.status });
        return acc;
    }, {});

    const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => moment(a, 'MMMM YYYY').diff(moment(b, 'MMMM YYYY')));

    if (loading) {
        return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
    }

    if (error) {
        return <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                Available Slots by Month
            </Typography>
            {sortedMonths.length === 0 ? (
                <Typography>No slots found.</Typography>
            ) : (
                sortedMonths.map(month => {
                    const dates = Object.keys(groupedByMonth[month]).sort();
                    return (
                        <Box
                            key={month}
                            sx={{
                                mb: 4,
                                p: 3,
                                border: '2px solid #e0e0e0',
                                borderRadius: 2,
                                backgroundColor: '#ffffff',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': { boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', transform: 'translateY(-2px)' },
                            }}
                        >
                            <Typography variant="h5" gutterBottom sx={{ color: '#424242', fontWeight: 'bold' }}>
                                {month} (1 - {moment(month, 'MMMM YYYY').daysInMonth()} {month.split(' ')[0]})
                            </Typography>
                            {dates.map(date => (
                                <Box key={date} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ color: '#616161', fontWeight: 'medium' }}>
                                        {date}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {groupedByMonth[month][date].map((slot, index) => (
                                            <Chip
                                                key={index}
                                                label={`${slot.startTime} - ${slot.endTime}`}
                                                variant="filled"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    backgroundColor: slot.status === 'available' ? '#c8e6c9' : '#ffcccc', // Light green for available, light red for booked
                                                    color: slot.status === 'available' ? '#2e7d32' : '#d32f2f', // Darker text for contrast
                                                    '&:hover': {
                                                        backgroundColor: slot.status === 'available' ? '#a5d6a7' : '#ef9a9a', // Lighter shades on hover
                                                    },
                                                    borderRadius: 12,
                                                    padding: '4px 12px',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    );
                })
            )}
        </Container>
    );
};

export default SlotManagementPage;