

import React, { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    IconButton,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { getIndividualSlotsByDate } from "@/services/timeslotService";
import { EventAvailable, EventBusy } from "@mui/icons-material";
import { updateBookingSlotService } from "@/services/bookingService";

interface SlotDetails {
    _id: string;
    start: string;
    end: string;
    status: string;
    course?: string;
    isWeekend?: boolean;
}

interface SlotWrapper {
    _id: string;
    customerId?: any;
    slot: SlotDetails;
    [key: string]: any;
}

type ConfirmationBookingModalProps = {
    open: boolean;
    onClose: () => void;
    slot: SlotWrapper | SlotDetails | null;
    bookingId: any;
};

export default function RescheduleBookingModal({
    open,
    onClose,
    slot,
    bookingId,
}: ConfirmationBookingModalProps) {
    const [slots, setSlots] = useState<SlotDetails[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<SlotDetails | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        const fetchSlots = async () => {
            if (!slot) return;
            const dateOnly = dayjs(slot.start).format("YYYY-MM-DD");
            try {
                const response = await getIndividualSlotsByDate(dateOnly, slot?.course);
                setSlots(response || []);
            } catch (err) {
                console.error("Error fetching slots:", err);
            }
        };
        fetchSlots();
    }, [slot]);

    const handleConfirmClick = async () => {
        if (selectedSlot) {
            try {
                const currentSlotId = slot ? slot._id : null;

                await updateBookingSlotService(
                    bookingId,
                    currentSlotId,
                    selectedSlot._id
                );

                setConfirmOpen(false);
                onClose();
            } catch (err) {
                console.error("Error updating booking slot:", err);
            }
        }
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 800,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        textAlign: "center",
                        maxHeight: "80vh",
                        overflowY: "auto",
                    }}
                >
                    <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}>
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                        Available Slots - {dayjs(slot?.start).format("dddd, DD MMM YYYY")}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.5 }}>
                        {slots.map((slotItem) => (
                            <Box
                                key={slotItem._id}
                                onClick={() => {
                                    if (slotItem.status === "available") {
                                        setSelectedSlot(slotItem);
                                        setConfirmOpen(true);
                                    }
                                }}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor:
                                        slotItem.status === "available" ? "#c8e6c9" : "#ffcccc",
                                    color: slotItem.status === "available" ? "#2e7d32" : "#d32f2f",
                                    borderRadius: 2,
                                    padding: "6px",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        backgroundColor:
                                            slotItem.status === "available" ? "#a5d6a7" : "#ef9a9a",
                                        transform: "scale(1.02)",
                                        cursor: "pointer",
                                    },
                                    textAlign: "center",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 0.5,
                                        mb: 0.5,
                                    }}
                                >
                                    {slotItem.status === "available" ? (
                                        <EventAvailable fontSize="small" />
                                    ) : (
                                        <EventBusy fontSize="small" />
                                    )}
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: "medium", fontSize: "0.85rem" }}
                                    >
                                        {`${dayjs(slotItem.start).format("h:mm A")} - ${dayjs(
                                            slotItem.end
                                        ).format("h:mm A")}`}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: "bold",
                                        color: slotItem.isWeekend ? "#d81b60" : "#1976d2",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {slotItem.isWeekend ? "Weekend" : "Weekday"}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Modal>

            <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Confirm Reschedule
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                        Are you sure you want to reschedule to{" "}
                        {dayjs(selectedSlot?.start).format("h:mm A")} -{" "}
                        {dayjs(selectedSlot?.end).format("h:mm A")}?
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button variant="outlined" onClick={() => setConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleConfirmClick}
                        >
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>




    );
}