import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import dayjs from "dayjs";
import { cancelBookingSlotService } from "@/services/bookingService";

interface CancelBookingOftheDayProps {
    open: boolean;
    onClose: () => void;
    slot?: { start: string; end: string; _id: string } | null;
    bookingId?: any;
}

const CancelBookingOftheDay: React.FC<CancelBookingOftheDayProps> = ({
    open,
    onClose,
    slot,
    bookingId,
}) => {

    const handleConfirmClick = async () => {
        if (bookingId && slot) {
            try {
                await cancelBookingSlotService(
                    bookingId,
                    slot._id
                );
                onClose();
            } catch (err) {
                console.error("Error cancel booking slot:", err);
            } finally {
                onClose();
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
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
                    Confirm Cancellation
                </Typography>

                <Typography sx={{ mb: 3 }}>
                    {/* Are you sure you want to cancel this booking
                    {slot
                        ? ` from ${slot.start} to ${slot.end}?`
                        : "?"} */}
                    Are you sure you want to cancel {slot?.start && dayjs(slot.start).format("D MMMM YYYY")} Booking?
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button variant="contained" color="error" onClick={handleConfirmClick}>
                        Confirm
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CancelBookingOftheDay;
