"use client";

import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import Select from "../form/Select";
import Label from "../form/Label";
import { ChevronDownIcon } from "@/icons";
import { changeTournamentStatus } from "@/services/tournamentService";

export default function TournamentStatusChanger({ open, handleClose, id, currentStatus }) {
    const [loading, setLoading] = useState(false);

    const statuses = [
        { label: "Planned", value: "planned" },
        { label: "Ongoing", value: "ongoing" },
        { label: "Completed", value: "completed" },
    ];

    // ✅ Initialize Formik
    const formik = useFormik({
        initialValues: {
            status: currentStatus || "planned",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await changeTournamentStatus(id, values.status);
            } catch (error) {
                console.error(error);

            } finally {
                setLoading(false);
                handleClose();
            }
        },
    });

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle className="text-lg font-semibold">
                Change Tournament Status
            </DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent className="space-y-4">
                    <FormControl fullWidth size="small">
                        <Label>Status</Label>
                        <div className="relative">
                            <Select
                                id="status"
                                name="status"
                                options={statuses}
                                placeholder="Select Status"
                                value={formik.values.status}
                                onChange={(value) => formik.setFieldValue("status", value)}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </FormControl>


                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

