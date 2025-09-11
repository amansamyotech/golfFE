'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Container, Card, Box, Typography, Divider, Grid, Stack, Chip, LinearProgress, Button } from '@mui/material';
import { getById } from '@/services/memberService';
import { useParams } from 'next/navigation';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';



export default function MemberDetailPage() {
    const theme = useTheme();
    const { id } = useParams();


    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleBack = () => {
        window.history.back();
    };

    useEffect(() => {
        async function fetchMember() {
            try {
                const response = await getById(id);
                console.log('Fetched member:', response);
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
                    {/* Left Column */}
                    <Grid item xs={12} md={6} sx={{ pr: { md: 4 } }}>
                        <Stack spacing={3}>
                            {[
                                { label: 'Email', value: <a href={`mailto:${member.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>{member.email}</a> },
                                { label: 'Phone', value: <a href={`tel:${member.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>{member.phone}</a> },
                                { label: 'Date of Birth', value: new Date(member.dob).toLocaleDateString() },
                                { label: 'Profile Type', value: member.profileType },
                            ].map((field, idx) => (
                                <Box key={idx}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {field.label}
                                    </Typography>
                                    <Typography variant="body2">{field.value}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={6} sx={{ pr: { md: 4 } }}>
                        <Stack spacing={3}>
                            {[
                                { label: 'Course', value: member.course?.name || '-' },
                                { label: 'Plan', value: <Chip label={member.plan?.title || '-'} size="small" /> },
                                { label: 'Status', value: <Chip label={member.status} color={member.status === 'ACTIVE' ? 'success' : 'error'} size="small" /> },
                                { label: 'Tee Time', value: member.teeTime || '-' },
                            ].map((field, idx) => (
                                <Box key={idx}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {field.label}
                                    </Typography>
                                    <Typography variant="body2">{field.value}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Card>
        </Container>

    );
}
