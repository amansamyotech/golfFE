"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    Typography,
} from "@mui/material";
import Select from "../form/Select";
import Label from "../form/Label";
import { ChevronDownIcon } from "@/icons";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { getAllStaff } from "@/services/staffService";
import { assignCaddy } from "@/services/bookingService";


export default function AssignCaddy({ open, handleClose, id, }) {
    
    const [loading, setLoading] = useState(false);
    const [staffList, setStaffList] = useState([]);

    const fetchData = async () => {
        try {
            const res = await getAllStaff();
            const availableStaff = res.filter((s) => s.availabilityStatus === "available" && s.department === 'caddy') || [];
            setStaffList(
                availableStaff.map((s) => ({
                    label: s.name,
                    value: s._id,
                }))
            );
        } catch (error) {
            console.error("Error fetching staff:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formik = useFormik({
        initialValues: {
            staff: "",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await assignCaddy(id, values.staff);
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
            <DialogTitle className="text-lg font-semibold">Assign Caddy</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent className="space-y-4">
                    <FormControl fullWidth size="small">
                        <Label>Select Staff</Label>
                        <div className="relative">
                            <Select
                                id="staff"
                                name="staff"
                                options={staffList}
                                placeholder="Select Staff"
                                value={formik.values.staff}
                                onChange={(value) => formik.setFieldValue("staff", value)}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 right-3 top-1/2 -translate-y-1/2 pointer-events-none dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? "Updating..." : "Assign"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}


