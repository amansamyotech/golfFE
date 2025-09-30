'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
} from '@mui/material';
import { toast } from 'react-toastify';
import { deleteGuest } from '@/services/guestService';
import { cancelGuestBooking } from '@/services/bookingService';
import CloseIcon from '@mui/icons-material/Close';

type DeleteBookingProps = {
    open: boolean;
    handleClose: () => void;
    id: string;
};

const DeleteBooking = ({ open, handleClose, id }: DeleteBookingProps) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await cancelGuestBooking(id);
        } catch (error) {
            console.error('Error deleting booking:', error);
            toast.error('Failed to delete booking.');
        } finally {
            setLoading(false);
            handleClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, p: 2 },
            }}
        >
            <DialogTitle>
                <Typography variant="h6" component="div">
                    Cancel Booking Confirmation
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Are you sure you want to cancel this booking?
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={handleDelete}
                    color="error"
                    variant="contained"
                    loading={loading}
                >
                    Confirm
                </Button>
                <Button onClick={handleClose} color="inherit" variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteBooking;

