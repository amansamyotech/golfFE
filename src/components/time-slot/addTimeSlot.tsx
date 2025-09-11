import * as React from 'react';
import { Dialog, Button, Typography, Grid, MenuItem } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { Modal } from '@/components/ui/modal';
import { useState, useEffect } from 'react';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import DatePicker from '../form/date-picker';
import { TimeInput } from "@heroui/react";
import { addTimeSlot } from '@/services/timeslotService';

interface AddTimeSlotProps {
    open: boolean;
    handleClose: () => void;
    data?: any;
}

const validationSchema = Yup.object().shape({
    start_date: Yup.date().required('Start date is required'),
    end_date: Yup.date().required('End date is required'),
    slot_time_minutes: Yup.number()
        .typeError('Slot time must be a number')
        .required('Slot time is required')
        .positive('Must be greater than 0')
        .integer('Must be an integer'),
    buffer_time_minutes: Yup.number()
        .typeError('Buffer time must be a number')
        .required('Buffer time is required')
        .positive('Must be greater than 0')
        .integer('Must be an integer'),
    ground_opening_time: Yup.string().required('Ground opening time is required'),
    ground_closing_time: Yup.string().required('Ground closing time is required'),
    status: Yup.string()
        .oneOf(['available', 'booked'], 'Invalid status')
        .required('Status is required'),
});

const AddTimeSlot: React.FC<AddTimeSlotProps> = ({ open, handleClose, data }) => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            start_date: data?.start_date ? data.start_date.split('T')[0] : '',
            end_date: data?.end_date ? data.end_date.split('T')[0] : '',
            slot_time_minutes: data?.slot_time_minutes || '',
            buffer_time_minutes: data?.buffer_time_minutes || '',
            ground_opening_time: data?.ground_opening_time || '',
            ground_closing_time: data?.ground_closing_time || '',
            status: data?.status || 'available',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            console.log("this is values", values);
            setLoading(true);
            try {
                await addTimeSlot(values);
                toast.success('Time slot saved successfully');
                handleClose();
                formik.resetForm();
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to save time slot');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <Modal isOpen={open} onClose={handleClose} className="max-w-[500px] p-6 lg:p-10">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-bold text-center flex-grow">
                        {data ? 'Edit Time Slot' : 'Add Time Slot'}
                    </Typography>
                    <ClearIcon onClick={handleClose} className="cursor-pointer" />
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <Grid >
                        <Grid item xs={12}>
                            <DatePicker
                                id="start_date"
                                label="Start Date"
                                placeholder="Select a date"
                                defaultDate={formik.values.start_date}
                                onChange={(date) => formik.setFieldValue("start_date", date)}
                            />
                            {formik.touched.start_date && formik.errors.start_date && (
                                <div className="text-red-400 text-xs ">{formik.errors.start_date}</div>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <DatePicker
                                id="end_date"
                                label="End Date"
                                placeholder="Select a date"
                                defaultDate={formik.values.end_date}
                                onChange={(date) => formik.setFieldValue("end_date", date)}
                            />
                            {formik.touched.end_date && formik.errors.end_date && (
                                <div className="text-red-400 text-xs ">{formik.errors.end_date}</div>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Label>Slot Time (Minutes)</Label>
                            <Input
                                id="slot_time_minutes"
                                name="slot_time_minutes"
                                type="number"
                                placeholder="e.g., 30"
                                value={formik.values.slot_time_minutes}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full"
                            />
                            {formik.touched.slot_time_minutes && formik.errors.slot_time_minutes && (
                                <div className="text-red-400 text-xs">{formik.errors.slot_time_minutes}</div>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Label>Buffer Time (Minutes)</Label>
                            <Input
                                id="buffer_time_minutes"
                                name="buffer_time_minutes"
                                type="number"
                                placeholder="e.g., 10"
                                value={formik.values.buffer_time_minutes}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full"
                            />
                            {formik.touched.buffer_time_minutes && formik.errors.buffer_time_minutes && (
                                <div className="text-red-400 text-xs">{formik.errors.buffer_time_minutes}</div>
                            )}
                        </Grid>



                        <Grid item xs={12}>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Ground Opening Time
                            </Label>
                            <div className="border border-gray-300 rounded-lg shadow-sm">
                                <TimeInput
                                    isRequired
                                    value={formik.values.ground_opening_time}
                                    onChange={(time) => formik.setFieldValue("ground_opening_time", time)}
                                    className="w-full"
                                />

                                {formik.touched.ground_opening_time && formik.errors.ground_opening_time && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {formik.errors.ground_opening_time}
                                    </div>
                                )}
                            </div>
                        </Grid>


                        <Grid item xs={12}>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Ground Closing Time
                            </Label>
                            <div className="border border-gray-300 rounded-lg shadow-sm">
                                <TimeInput
                                    isRequired
                                    value={formik.values.ground_closing_time}
                                    onChange={(time) => formik.setFieldValue("ground_closing_time", time)}
                                    className="w-full"
                                />

                                {formik.touched.ground_closing_time && formik.errors.ground_closing_time && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {formik.errors.ground_closing_time}
                                    </div>
                                )}
                            </div>
                        </Grid>
                    </Grid>

                    <div className="flex justify-center mt-6 gap-4">
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                                formik.resetForm();
                                handleClose();
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddTimeSlot;
