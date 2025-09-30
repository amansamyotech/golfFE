'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Container, Card, Box, Typography, Divider, Grid, Stack, Chip, Button } from '@mui/material';
import { useParams } from 'next/navigation';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { getById } from '@/services/customerService';

interface Member {
    _id: string;
    name: string;
    email: string;
    phone: string;
    dob: string;
    profileType: string;
    course?: { name: string };
    plan?: { title: string };
    status: string;
    teeTime?: string;
}

export default function MemberDetailPage() {
    const theme = useTheme();
    const { id } = useParams<{ id: string }>();


    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);

    const handleBack = () => {
        window.history.back();
    };

    useEffect(() => {
        async function fetchMember() {
            try {
                const response = await getById(id) as Member;
                setMember(response);
            } catch (error) {
                console.error('Failed to fetch member:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchMember();
    }, [id]);

    if (loading) {
        return <Typography>Loading member details...</Typography>;
    }

    if (!member) {
        return <Typography>Member not found.</Typography>;
    }

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
                            {member.name}
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
                        Member ID: {member._id}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4, borderColor: theme.palette.divider, opacity: 0.8 }} />

                <Grid container spacing={6}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={6}>

                        {/* Left Column */}
                        <Box sx={{ flex: 1, paddingRight: { xs: 0, md: 4 } }}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Email
                                    </Typography>
                                    <Typography variant="body2">
                                        <a href={`mailto:${member.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {member.email}
                                        </a>
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Phone
                                    </Typography>
                                    <Typography variant="body2">
                                        <a href={`tel:${member.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {member.phone}
                                        </a>
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Date of Birth
                                    </Typography>
                                    <Typography variant="body2">
                                        {member.dob ? new Date(member.dob).toLocaleDateString() : '-'}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Profile Type
                                    </Typography>
                                    <Typography variant="body2">
                                        {member.profileType || '-'}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Preferred Tee Time
                                    </Typography>
                                    <Typography variant="body2">
                                        {member.preferredTeeTime || '-'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                        {/* Right Column */}
                        <Box sx={{ flex: 1, paddingRight: { xs: 0, md: 4 } }}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Plan
                                    </Typography>
                                    <Typography variant="body2">
                                        {member.plan?.title || '-'}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Start Date
                                    </Typography>
                                    <Typography variant="body2">
                                        {member.startDate ? new Date(member.startDate).toLocaleDateString() : '-'}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Expiry Date
                                    </Typography>
                                    <Typography variant="body2">
                                        {member.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : '-'}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Status
                                    </Typography>
                                    <Typography variant="body2">
                                        <Chip label={member.status} color={member.status === 'ACTIVE' ? 'success' : 'error'} size="small" />
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                    </Stack>
                </Grid>

            </Card>
        </Container>

    );
}
