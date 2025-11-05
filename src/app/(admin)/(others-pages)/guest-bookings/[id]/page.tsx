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
    Chip,
    // Grid
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit, Delete } from '@mui/icons-material';
import { useParams } from 'next/navigation';
import { getBookingByID } from '@/services/bookingService';
import RescheduleBookingModal from '@/components/tee-time-management/rescheduleBooking';
import CancelBookingOfGuest from '@/components/guest/cancelBookingOfGuest';
import moment from 'moment';
import Grid from "@mui/material/Grid";

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
    groupSize: number;
    paymentMode: string;
}
interface Course {
    _id: string;
    name: string;
}

interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
}
interface Slot {
    _id: string;
    start: string;
    end: string;
    status: string;
}

export default function GuestDetailPage() {
    const theme = useTheme();
    const { id } = useParams();
    const [guest, setGuest] = useState<Guest | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
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
        slots?.forEach(slot => {
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
            <CancelBookingOfGuest open={openCancelModal} onClose={handleCloseCancel} slot={selectedSlot} bookingId={id} />
            <RescheduleBookingModal open={openRescheduleModal} onClose={handleCloseReschedule} slot={selectedSlot} bookingId={id} />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Card
                    sx={{
                        p: 4,
                        mb: 4,
                        boxShadow: theme.shadows[4],
                        borderRadius: 3,
                        backgroundColor: "#fff",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h5" fontWeight={700}>
                            {guest?.customerId?.name} - Booking Details
                        </Typography>
                        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                            Back
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Stack spacing={1.5}>
                            <Typography><strong>Email:</strong> {guest?.customerId?.email}</Typography>
                            <Typography><strong>Course Name:</strong> {guest?.course?.name}</Typography>
                            <Typography><strong>Booking Type:</strong> {guest?.bookingType}</Typography>
                            <Typography><strong>Caddy:</strong> {guest?.caddyCart ? 'Selected ' : 'Not Selected'} </Typography>
                        </Stack>

                        <Stack spacing={1.5}>
                            <Typography><strong>Phone:</strong> {guest?.customerId?.phone}</Typography>
                            <Typography>
                                <strong>Booking Date:</strong> {moment().format('DD MMM YYYY')}
                            </Typography>
                            <Typography><strong>Group Size:</strong> {guest?.groupSize}</Typography>
                            {
                                guest?.caddyId ? <Typography><strong>Caddy Name:</strong> {guest?.caddyId?.name}</Typography> : <></>
                            }
                        </Stack>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {guest.slotIds && guest.slotIds.length > 0 ? (
                        guest.slotIds.map((slot) => (
                            <Box key={slot._id} sx={{ mt: 3 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mb: 1 }}
                                >
                                    <Typography variant="h6" fontWeight={600}>
                                        Assigned Slot
                                    </Typography>

                                    <Chip
                                        label={guest?.bookingStatus.charAt(0).toUpperCase() + guest?.bookingStatus.slice(1)}
                                        size="small"
                                        sx={{
                                            bgcolor: guest?.bookingStatus === "confirmed" ? "#dcfce7" : "#fee2e2",
                                            color: guest?.bookingStatus === "confirmed" ? "#16a34a" : "#dc2626",
                                            fontWeight: 600,
                                            borderRadius: 1,
                                        }}
                                    />
                                </Stack>

                                <Grid container spacing={2}>
                                    <Typography>
                                        <strong>Date:</strong>{" "}
                                        {new Date(slot.start).toLocaleDateString("en-GB", {
                                            weekday: "long",
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </Typography>

                                    <Typography>
                                        <strong>Time:</strong>{" "}
                                        {`${new Date(slot.start).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })} - ${new Date(slot.end).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}`}
                                    </Typography>

                                    <Typography>
                                        <strong>Course:</strong> {guest?.course?.name || "N/A"}
                                    </Typography>

                                </Grid>

                                <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<Edit />}
                                        sx={{
                                            bgcolor: "#2563eb",
                                            "&:hover": { bgcolor: "#1e40af" },
                                        }}
                                        onClick={() => handleOpenReschedule(slot)}
                                    >
                                        Reschedule
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        startIcon={<Delete />}
                                        onClick={() => handleOpenCancel(slot)}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </Box>
                        ))
                    ) : (
                        <></>
                    )}
                </Card>
            </Container>
        </>
    );
}
