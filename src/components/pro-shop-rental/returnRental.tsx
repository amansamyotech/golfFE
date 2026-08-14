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
    Divider,
    CircularProgress,
    TextField,
    Stack,
} from '@mui/material';
import { Replay, Cancel } from '@mui/icons-material';
// import { updateRental } from '@/services/rentalProductService';
import { returnRental } from '@/services/rentalProductService';

interface ConfirmReturnDialogProps {
    open: boolean;
    handleClose: () => void;
    data?: any;
}

const ConfirmReturnDialog: React.FC<ConfirmReturnDialogProps> = ({
    open,
    handleClose,
    data,
}) => {
    const [loading, setLoading] = useState(false);


    const handleReturn = async () => {
        try {
            setLoading(true);
            await returnRental(data._id, data);
        } catch (error) {
            console.error('Error returning product:', error);
        } finally {
            setLoading(false);
            handleClose();
        }
    };

    if (!data) return null;

    const { productId, customerId, quantity, rentedDate, returnDate, totalAmount } = data;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, p: 1 },
            }}
        >
            <DialogTitle>
                <Typography variant="h6" fontWeight="bold">
                    Confirm Product Return
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        {productId?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {productId?.category} • Quantity: {quantity}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1.2}>
                    <Typography variant="body2">
                        <strong>Customer:</strong> {customerId?.name} ({customerId?.email})
                    </Typography>
                    <Typography variant="body2">
                        <strong>Rented on:</strong> {new Date(rentedDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Expected return:</strong> {new Date(returnDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Total Amount:</strong> ₹{totalAmount}
                    </Typography>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={handleReturn}
                    color="success"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Replay />}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Confirm Return'}
                </Button>

                <Button onClick={handleClose} color='error' variant="outlined" startIcon={<Cancel />}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmReturnDialog;




