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
} from '@mui/material';
import { deletePlan } from '@/services/plansService';
import { deleteTournament } from '@/services/tournamentService';
import { deletePlayer } from '@/services/playersService';

type DeleteMemberProps = {
    open: boolean;
    handleClose: () => void;
    id: string;
};

const DeletePlayer = ({ open, handleClose, id }: DeleteMemberProps) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deletePlayer(id);
        } catch (error) {
            console.error('Error deleting tournament:', error);
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
                    Delete Player Details Confirmation
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Are you sure you want to delete this player?
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
                    Delete
                </Button>
                <Button onClick={handleClose} color="inherit" variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeletePlayer;

