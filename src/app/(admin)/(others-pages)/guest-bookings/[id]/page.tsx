'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Container, Card, Box, Typography, Divider, Stack, Button } from '@mui/material';
import { useParams } from 'next/navigation';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Image from 'next/image';
import { getById } from '@/services/guestService';
import moment from 'moment';

interface Course {
    _id: string;
    name: string;
}
interface Guest {
    _id: string;
    name: string;
    email: string;
    phone: string;
    govId: string;
    acceptRules: boolean;
    acknowledgePolicy: boolean;
    course?: Course;
    amount: number;
    paymentMode: string;
    startDateTime: string;
    endDateTime: string;
}

export default function GuestDetailPage() {
    const theme = useTheme();
    const { id } = useParams();

    const [guest, setGuest] = useState<Guest | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const handleBack = () => {
        window.history.back();
    };

    useEffect(() => {
        async function fetchMember() {
            try {
                const response = await getById(id) as Guest;
                setGuest(response);
            } catch (error) {
                console.error('Failed to fetch member:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchMember();
    }, [id]);




    if (!id) return <Typography>ID not found.</Typography>;
    if (loading) return <Typography>Loading guest details...</Typography>;
    if (!guest) return <Typography>Guest not found.</Typography>;

    return (
        <Container maxWidth="lg">
            <Card
                sx={{
                    p: { xs: 3, sm: 3, md: 4 },
                    boxShadow: theme.shadows[4],
                    borderRadius: 3,
                    bgcolor: theme.palette.background.paper,
                    transition: 'all 0.3s ease-in-out',
                }}
                role="region"
                aria-labelledby="member-details-heading"
            >
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            textAlign: { xs: 'center', sm: 'left' },
                        }}
                    >
                        <Typography
                            variant="h5"
                            id="member-details-heading"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                            }}
                        >
                            {guest.customerId.name}
                        </Typography>

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleBack}
                            sx={{ mt: { xs: 2, sm: 0 } }}
                        >
                            Back
                        </Button>
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, fontSize: '0.875rem', textAlign: { xs: 'center', sm: 'left' } }}
                    >
                        Guest ID: {guest._id}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4, borderColor: theme.palette.divider, opacity: 0.8 }} />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={6}>
                    <Box sx={{ flex: 1, paddingRight: { xs: 0, md: 4 } }}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Email
                                </Typography>
                                <Typography variant="body2">
                                    <a href={`mailto:${guest.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {guest.customerId.email}
                                    </a>
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Phone
                                </Typography>
                                <Typography variant="body2">
                                    <a href={`tel:${guest.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {guest.customerId.phone}
                                    </a>
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Course
                                </Typography>
                                <Typography variant="body2">
                                    {guest.course?.name || '-'}
                                </Typography>
                            </Box>
                            {/* groupSize */}

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Group Size
                                </Typography>
                                <Typography variant="body2">
                                    {guest.groupSize || '- -'}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Accept Rules
                                </Typography>
                                <Typography variant="body2">
                                    {guest.acceptRules ? 'Yes' : 'No'}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ flex: 1, paddingRight: { xs: 0, md: 4 } }}>
                        <Stack spacing={3}>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Booking Date
                                </Typography>
                                <Typography variant="body2">
                                    {moment(guest.startTime).format("DD-MM-YYYY")}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Slot Timing
                                </Typography>
                                <Typography variant="body2">
                                    {moment(guest.startTime).format('HH:mm')} to {moment(guest.endTime).format('HH:mm')},
                                </Typography>
                            </Box>


                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Amount
                                </Typography>
                                <Typography variant="body2">
                                    {guest.amount || '- -'}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Payment Mode
                                </Typography>
                                <Typography variant="body2">
                                    {guest.paymentMode || '- -'}
                                </Typography>
                            </Box>



                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Acknowledge Policy
                                </Typography>
                                <Typography variant="body2">
                                    {guest.acknowledgePolicy ? 'Yes' : 'No'}
                                </Typography>
                            </Box>
                        </Stack>

                    </Box>
                </Stack>
            </Card>
        </Container>
    );
}
