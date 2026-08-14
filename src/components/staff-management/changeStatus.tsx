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
import { changeAvailabilityStatus } from "@/services/staffService";

export default function changeAvailability({ open, handleClose, id, currentStatus }) {
    const [loading, setLoading] = useState(false);

    const statuses = [
        { label: "Available", value: "available" },
        { label: "Assigned", value: "assigned" },
        { label: "Onleave", value: "onleave" },
        { label: "Inactive", value: "inactive" },
    ];

    const formik = useFormik({
        initialValues: {
            availabilityStatus: currentStatus || "available",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await changeAvailabilityStatus(id, values.availabilityStatus);
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
                Change Working Shift Status
            </DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent className="space-y-4">
                    <FormControl fullWidth size="small">
                        <Label>Status</Label>
                        <div className="relative">
                            <Select
                                id="availabilityStatus"
                                name="availabilityStatus"
                                options={statuses}
                                placeholder="Select Status"
                                value={formik.values.availabilityStatus}
                                onChange={(value) => formik.setFieldValue("availabilityStatus", value)}
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

