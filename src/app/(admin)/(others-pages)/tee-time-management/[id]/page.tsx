

'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Container,
    Card,
    Box,
    Typography,
    Divider,
    Stack,
    Button,
    Grid,
    Collapse,
    IconButton,
    CardContent,
    Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ExpandMore, ExpandLess, Edit, Delete } from '@mui/icons-material';
import { useParams } from 'next/navigation';
import { getBookingByID } from '@/services/bookingService';
import RescheduleBookingModal from '@/components/tee-time-management/rescheduleBooking';
import CancelBookingOftheDay from '@/components/tee-time-management/cancelBookingOfTheDay';

interface Course {
    _id: string;
    name: string;
}
interface Slot {
    _id: string;
    start: string;
    end: string;
    status: string;
}
interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
}
interface Guest {
    _id: string;
    customerId: Customer;
    course: Course;
    amount: number;
    bookingStatus: string;
    bookingType: string;
    caddyCart: boolean;
    slotIds: Slot[];
    specialInfo: string;
    createdAt: string;
    updatedAt: string;
}

export default function GuestDetailPage() {
    const theme = useTheme();
    const { id } = useParams();
    const [guest, setGuest] = useState<Guest | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [openMonth, setOpenMonth] = useState<string | null>(null);
    const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [openCancelModal, setOpenCancelModal] = useState(false);

    const handleBack = () => {
        window.history.back();
    };

    useEffect(() => {
        async function fetchBookedSlots() {
            try {
                const response = await getBookingByID(id) as Guest;
                setGuest(response);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchBookedSlots();
    }, [id, openRescheduleModal, openCancelModal]);

    const groupSlotsByMonth = (slots: Slot[]) => {
        const grouped: { [month: string]: Slot[] } = {};
        slots.forEach(slot => {
            const month = new Date(slot.start).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!grouped[month]) grouped[month] = [];
            grouped[month].push(slot);
        });
        return grouped;
    };

    if (loading) {
        return <Typography variant="h6" sx={{ mt: 4 }}>Loading...</Typography>;
    }

    if (!guest) {
        return <Typography variant="h6" sx={{ mt: 4 }}>No booking found.</Typography>;
    }

    const groupedSlots = groupSlotsByMonth(guest.slotIds);

    const handleOpenReschedule = (slot: any) => {
        setSelectedSlot(slot);
        setOpenRescheduleModal(true);
    }

    const handleCloseReschedule = () => {
        setSelectedSlot(null);
        setOpenRescheduleModal(false);
    }

    const handleOpenCancel = (slot: any) => {
        setSelectedSlot(slot);
        setOpenCancelModal(true);
    }

    const handleCloseCancel = () => {
        setOpenCancelModal(false);
    }

    return (
        <>
            <CancelBookingOftheDay open={openCancelModal} onClose={handleCloseCancel} slot={selectedSlot} bookingId={id} />
            <RescheduleBookingModal open={openRescheduleModal} onClose={handleCloseReschedule} slot={selectedSlot} bookingId={id} />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Member Details */}
                <Card sx={{ p: 3, mb: 4, boxShadow: theme.shadows[4], borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" fontWeight={700}>
                            {guest.customerId.name} - Booking Details
                        </Typography>
                        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                            Back
                        </Button>
                    </Box>
                    <Divider sx={{ my: 2 }} />


                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <Typography><strong>Email:</strong> {guest.customerId.email}</Typography>
                                <Typography><strong>Phone:</strong> {guest.customerId.phone}</Typography>
                                <Typography><strong>Course:</strong> {guest.course.name}</Typography>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <Typography><strong>Booking Type:</strong> {guest.bookingType}</Typography>
                                <Typography><strong>Status:</strong> {guest.bookingStatus}</Typography>
                                <Typography><strong>Special Info:</strong> {guest.specialInfo}</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>

                {/* Slots Section */}
                <Box>
                    <Typography variant="h6" mb={2}>Assigned Slots</Typography>
                    {
                        Object.keys(groupedSlots).length === 0 ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '150px',
                                }}
                            >
                                <Typography color="text.secondary" align="center">
                                    No slots assigned yet.
                                </Typography>
                            </Box>
                        ) : (Object.entries(groupedSlots).map(([month, slots]) => (
                            <Box key={month} sx={{ mb: 3 }}>
                                <Card
                                    sx={{ p: 2, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                                    onClick={() => setOpenMonth(openMonth === month ? null : month)}
                                >
                                    <Typography variant="subtitle1">{month} ({slots.length} Slots)</Typography>
                                    <IconButton>{openMonth === month ? <ExpandLess /> : <ExpandMore />}</IconButton>
                                </Card>
                                <Collapse in={openMonth === month}>
                                    <Grid container spacing={2} sx={{ mt: 1, padding: 0 }}>
                                        {slots.map((slot) => (
                                            <Grid item xs={12} sm={6} md={4} key={slot._id}>
                                                <Card
                                                    sx={{
                                                        border: "1px solid #e5e7eb",
                                                        borderRadius: 3,
                                                        p: 2,
                                                        backgroundColor: "#fff",
                                                        transition: "0.2s",
                                                        "&:hover": {
                                                            borderColor: "#3b82f6",
                                                            backgroundColor: "#f9fafb",
                                                        },
                                                    }}
                                                >
                                                    <Stack spacing={1}>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                            <Typography variant="subtitle1" fontWeight={600}>
                                                                {new Date(slot.start).toLocaleDateString("en-US", {
                                                                    weekday: "long",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                })}
                                                            </Typography>

                                                            <Chip
                                                                label={slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                                                                size="small"
                                                                sx={{
                                                                    width: "fit-content",
                                                                    bgcolor: slot.status === "booked" ? "#dcfce7" : "#fee2e2",
                                                                    color: slot.status === "booked" ? "#16a34a" : "#dc2626",
                                                                    fontWeight: 600,
                                                                    mt: 1,
                                                                    borderRadius: 1,
                                                                }}
                                                            />
                                                        </Stack>

                                                        <Typography variant="body2">
                                                            <strong>Slot :</strong>{" "}
                                                            {`${new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(slot.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                                                        </Typography>

                                                        <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                                                            <Button
                                                                // variant="contained"
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => handleOpenReschedule(slot)}
                                                                startIcon={<Edit />}

                                                            >
                                                                Reschedule
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleOpenCancel(slot)}
                                                                startIcon={<Delete />}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </Stack>
                                                    </Stack>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Collapse>
                            </Box>
                        )))
                    }
                </Box>
            </Container>
        </>
    );
}




{/* <Collapse in={openMonth === month}>
                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        {slots.map(slot => (
                                            <Grid item xs={12} sm={6} md={4} key={slot._id}>
                                                <Card sx={{ p: 2 }}>
                                                    <Typography><strong>Start:</strong> {slot.start}</Typography>
                                                    <Typography><strong>End:</strong> {slot.end}</Typography>
                                                    <Typography><strong>Status:</strong> {slot.status}</Typography>

                                                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                                        <Button variant="contained" startIcon={<Edit />} size="small" onClick={() => handleOpenReschedule(slot)}>
                                                            Reschedule
                                                        </Button>
                                                        <Button variant="outlined" color="error" startIcon={<Delete />} size="small">
                                                            Cancel
                                                        </Button>
                                                    </Stack>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Collapse> */}
