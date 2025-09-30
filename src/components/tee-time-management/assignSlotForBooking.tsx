import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Chip, CircularProgress, Badge } from '@mui/material';
import { getAllIndividualSlots } from '@/services/timeslotService';
import moment from 'moment';
import { EventAvailable, EventBusy } from '@mui/icons-material';

const AssignSlotForBooking = () => {
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
        const startTime = startDate.format('h:mm A');
        const endDate = moment(slot.end, 'YYYY-MM-DD HH:mm');
        const endTime = endDate.format('h:mm A');
        const isWeekend = slot.is_weekend;

        if (!acc[monthYear]) {
            acc[monthYear] = {};
        }
        if (!acc[monthYear][date]) {
            acc[monthYear][date] = [];
        }
        acc[monthYear][date].push({ startTime, endTime, status: slot.status, isWeekend });
        return acc;
    }, {});

    const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => moment(a, 'MMMM YYYY').diff(moment(b, 'MMMM YYYY')));

    if (loading) {
        return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
    }

    if (error) {
        return <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>{error}</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    color: '#1976d2',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    mb: 4,
                }}
            >
                Available Slots
            </Typography>
            {sortedMonths.length === 0 ? (
                <Typography variant="h6" sx={{ textAlign: 'center', color: '#616161' }}>
                    No slots found.
                </Typography>
            ) : (
                sortedMonths.map(month => {
                    const dates = Object.keys(groupedByMonth[month]).sort();
                    return (
                        <Box
                            key={month}
                            sx={{
                                mb: 4,
                                p: 3,
                                border: '1px solid #e0e0e0',
                                borderRadius: 3,
                                backgroundColor: '#fafafa',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                                    transform: 'translateY(-3px)',
                                },
                            }}
                        >
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{
                                    color: '#424242',
                                    fontWeight: 'bold',
                                    borderBottom: '2px solid #1976d2',
                                    pb: 1,
                                    mb: 2,
                                }}
                            >
                                {month}
                            </Typography>
                            {dates.map(date => (
                                <Box key={date} sx={{ mb: 3, px: 1 }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            color: '#616161',
                                            fontWeight: 'medium',
                                            mb: 1.5,
                                        }}
                                    >
                                        {moment(date, 'DD-MM-YYYY').format('dddd, DD MMMM YYYY')}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)', // 3 slots per row
                                            gap: 1.5, // Added space between slots
                                            width: '100%',
                                        }}
                                    >
                                        {groupedByMonth[month][date].map((slot, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor:
                                                        slot.status === 'available'
                                                            ? '#c8e6c9'
                                                            : '#ffcccc',
                                                    color:
                                                        slot.status === 'available'
                                                            ? '#2e7d32'
                                                            : '#d32f2f',
                                                    borderRadius: 2, // Square shape with slight rounding
                                                    padding: '6px',
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            slot.status === 'available'
                                                                ? '#a5d6a7'
                                                                : '#ef9a9a',
                                                        transform: 'scale(1.02)',
                                                    },
                                                    textAlign: 'center',
                                                    // minHeight: '100px', // Consistent height for square shape
                                                    // aspectRatio: '1 / 1', // Ensures square shape
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                                                    {slot.status === 'available' ? (
                                                        <EventAvailable fontSize="small" />
                                                    ) : (
                                                        <EventBusy fontSize="small" />
                                                    )}
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 'medium', fontSize: '0.85rem' }}
                                                    >
                                                        {`${slot.startTime} - ${slot.endTime}`}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        color: slot.isWeekend ? '#d81b60' : '#1976d2',
                                                        fontSize: '0.75rem',
                                                    }}
                                                >
                                                    {slot.isWeekend ? 'Weekend' : 'Weekday'}
                                                </Typography>
                                            </Box>
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

export default AssignSlotForBooking;