import React from "react";
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
import { assignSlot } from "@/services/bookingService";

// interface ConfirmationBookingModalProps {
//     open: boolean;
//     onClose: () => void;
//     slot: {
//         start: string;
//         end: string;
//         status: string;
//         isWeekend?: boolean;
//     } | null;
// }

interface SlotDetails {
    _id: string;
    start: string;
    end: string;
    status: string;
    course?: string;
    isWeekend?: boolean;
    slot?: any;
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
    slot: SlotWrapper | SlotDetails | null | any;
};

export default function ConfirmationBookingModal({
    open,
    onClose,
    slot,
}: ConfirmationBookingModalProps) {
    if (!slot) return null;

    const slotsToShow = Array.isArray((slot as any).slot)
        ? (slot as any).slot
        : [slot.slot];

    const isAvailable = slotsToShow.every((s: any) => s.status === "available");

    const handleConfirm = async () => {
        try {
            const response = await assignSlot(slot?._id, slot);
        } catch (err) {
            console.error("Error fetching slots:", err);
        } finally {
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 4, textAlign: "center" }}>
                <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}>
                    <CloseIcon />
                </IconButton>

                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Confirm Booking</Typography>
                <Divider sx={{ mb: 2 }} />
                {/* 
                {slotsToShow.map((slotItem: any, index: number) => (
                    <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            <strong>Date:</strong> {dayjs(slotItem.start).format("dddd, MMMM D, YYYY")}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Time:</strong> {dayjs(slotItem.start).format("h:mm A")} - {dayjs(slotItem.end).format("h:mm A")}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                    </Box>
                ))} */}

                {isAvailable ? (
                    <>
                        <Typography sx={{ mb: 2 }}>Are you sure you want to book this slot(s)?</Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button variant="outlined" color="error" onClick={onClose}>Cancel</Button>
                            <Button variant="contained" color="primary" onClick={handleConfirm}>Confirm</Button>
                        </Box>
                    </>
                ) : (
                    <Typography color="error" sx={{ mb: 2 }}>One or more slots are not available for booking.</Typography>
                )}
            </Box>
        </Modal>
    );
}


