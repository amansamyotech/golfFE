import * as React from 'react';
import { Button, Typography, Grid } from '@mui/material';
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
import { addTimeSlot, updateTimeSlot } from '@/services/timeslotService';
import { getAllCourses } from '@/services/courseService';
import Select from '../form/Select';
import { ChevronDownIcon } from '@/icons';
import { Time } from "@internationalized/date";
interface TimeSlotData {
    _id?: string;
    start_date?: string;
    course?: { _id: string; name: string } | any;
    slot_time_hours?: number | string;
    slot_time_minutes?: number | string;
    weekday_opening_time?: string | any;
    weekday_closing_time?: string | any;
    weekend_opening_time?: string | any;
    weekend_closing_time?: string | any;
    total_slot_time?: number | string;
    buffer_time?: number | string;
    status?: 'available' | 'booked';
}

interface Course {
    _id: string;
    name: string
}
interface AddTimeSlotProps {
    open: boolean;
    handleClose: () => void;
    data?: TimeSlotData;
}

// const validationSchema = Yup.object().shape({
//     start_date: Yup.date().required('Start date is required'),
//     course: Yup.string().required('Course is required'),
//     slot_time_hours: Yup.number()
//         .typeError('Slot time must be a number')
//         .required('Slot time is required')
//         .positive('Must be greater than 0')
//         .integer('Must be an integer'),
//     slot_time_minutes: Yup.number()
//         .typeError('Slot time must be a number')
//         .required('Slot time is required')
//         // .positive('Must be greater than 0')
//         .integer('Must be an integer'),
//     buffer_time: Yup.number()
//         .typeError('Buffer time must be a number')
//         .required('Buffer time is required')
//         .positive('Must be greater than 0')
//         .integer('Must be an integer'),
//     weekday_opening_time: Yup.string().required('Weekday opening time is required'),
//     weekday_closing_time: Yup.string().required('Weekday closing time is required'),
//     weekend_opening_time: Yup.string().required('Weekend opening time is required'),
//     weekend_closing_time: Yup.string().required('Weekend closing time is required'),
//     status: Yup.string()
//         .oneOf(['available', 'booked'], 'Invalid status')
//         .required('Status is required'),
// });

const validationSchema = Yup.object().shape({
  start_date: Yup.date().required('Start date is required'),
  course: Yup.string().required('Course is required'),

  slot_time_hours: Yup.number()
    .typeError('Slot time must be a number')
    .required('Slot time is required')
    .min(0, 'Hours cannot be negative')
    .integer('Must be an integer'),

  slot_time_minutes: Yup.number()
    .typeError('Slot time must be a number')
    .required('Slot time is required')
    .min(0, 'Minutes cannot be negative')
    .max(59, 'Minutes must be less than 60')
    .integer('Must be an integer'),

  buffer_time: Yup.number()
    .typeError('Buffer time must be a number')
    .required('Buffer time is required')
    .positive('Must be greater than 0')
    .integer('Must be an integer'),

  weekday_opening_time: Yup.string().required('Weekday opening time is required'),
  weekday_closing_time: Yup.string().required('Weekday closing time is required'),
  weekend_opening_time: Yup.string().required('Weekend opening time is required'),
  weekend_closing_time: Yup.string().required('Weekend closing time is required'),

  status: Yup.string()
    .oneOf(['available', 'booked'], 'Invalid status')
    
    .required('Status is required'),
})
  // 👇 Simple combined validation at the end
  .test('total-slot-time', 'Total slot time must be greater than 0', function (values) {
    const totalMinutes = (values.slot_time_hours || 0) * 60 + (values.slot_time_minutes || 0);
    return totalMinutes > 0;
  });


const AddTimeSlot: React.FC<AddTimeSlotProps> = ({ open, handleClose, data }) => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);

    const formik = useFormik({
        initialValues: {
            start_date: data?.start_date ? data.start_date.split('T')[0] : '',
            slot_time_hours: data?.slot_time_hours || '',
            slot_time_minutes: data?.slot_time_minutes || '',
            buffer_time: data?.buffer_time || '',
            weekday_opening_time: data?.weekday_opening_time || '',
            weekday_closing_time: data?.weekday_closing_time || '',
            weekend_opening_time: data?.weekend_opening_time || '',
            weekend_closing_time: data?.weekend_closing_time || '',
            status: data?.status || 'available',
            course: data?.course || '',

        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {


            const totalSlotTimeMinutes = Number(values.slot_time_hours) * 60 + Number(values.slot_time_minutes);
            await formik.setFieldValue('total_slot_time', totalSlotTimeMinutes);


            setLoading(true);
            try {
                if (data) {
                    await updateTimeSlot(data?._id, values);
                } else {
                    await addTimeSlot(values);
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to save time slot');
            } finally {
                setLoading(false);
                handleClose();
                formik.resetForm();
            }
        },
    });

    const fetchCourses = async () => {
        const fetchedCourses = await getAllCourses() as Course[];
        const formattedCourses = fetchedCourses?.map((course) => ({
            value: course._id,
            label: course.name,
        }));
        setCourses(formattedCourses);
    };

    useEffect(() => {
        fetchCourses();
    }, [open]);

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
                        <Grid>
                            <DatePicker
                                id="start_date"
                                label="Start Date"
                                placeholder="Select a date"
                                // defaultDate={formik.values.start_date}
                                // onChange={(date) => {
                                //     formik.setFieldValue("start_date", date)
                                // }}
                                defaultDate={
                                    formik.values.start_date
                                        ? new Date(formik.values.start_date)
                                        : undefined
                                }
                                onChange={(date) => formik.setFieldValue("start_date", date)}
                            />
                            {formik.touched.start_date && formik.errors.start_date && (
                                <div className="text-red-400 text-xs ">{formik.errors.start_date}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Course</Label>
                            <div className="relative">
                                <Select
                                    id="course"
                                    options={courses}
                                    placeholder="Select Course"
                                    value={formik.values.course}
                                    onChange={(option) => formik.setFieldValue("course", option)}
                                    className="dark:bg-dark-900"
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                                {formik.touched.course && formik.errors.course && (
                                    <div className="text-red-400 text-xs ">
                                        {formik.errors.course as string}
                                    </div>
                                )}
                            </div>
                        </Grid>

                        <Grid>
                            <Label>Slot Time Hours</Label>
                            <Input
                                id="slot_time_hours"
                                name="slot_time_hours"
                                type="number"
                                placeholder="e.g., 1"
                                value={formik.values.slot_time_hours}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full"
                            />
                            {formik.touched.slot_time_hours && formik.errors.slot_time_hours && (
                                <div className="text-red-400 text-xs">{formik.errors.slot_time_hours}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Slot Time Minutes</Label>
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

                        <Grid>
                            <Label>Buffer Time (Minutes)</Label>
                            <Input
                                id="buffer_time"
                                name="buffer_time"
                                type="number"
                                placeholder="e.g., 10"
                                value={formik.values.buffer_time}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full"
                            />
                            {formik.touched.buffer_time && formik.errors.buffer_time && (
                                <div className="text-red-400 text-xs">{formik.errors.buffer_time}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Ground Opening Time (On Weekdays)
                            </Label>
                            <div className="border border-gray-300 rounded-lg shadow-sm">
                                <TimeInput
                                    isRequired
                                    value={
                                        formik.values.weekday_opening_time
                                            ? (() => {
                                                const [h, m] = formik.values.weekday_opening_time.split(":").map(Number);
                                                return new Time(h, m);
                                            })()
                                            : undefined
                                    }
                                    onChange={(time) =>
                                        formik.setFieldValue(
                                            "weekday_opening_time",
                                            time ? `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}` : ""
                                        )
                                    }
                                    className="w-full"
                                />

                                {formik.touched.weekday_opening_time && formik.errors.weekday_opening_time && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {formik.errors.weekday_opening_time as string}
                                    </div>
                                )}
                            </div>
                        </Grid>

                        <Grid>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Ground Closing Time (On Weekdays)
                            </Label>
                            <div className="border border-gray-300 rounded-lg shadow-sm">
                                <TimeInput
                                    isRequired
                                    value={
                                        formik.values.weekday_closing_time
                                            ? (() => {
                                                const [h, m] = formik.values.weekday_closing_time.split(":").map(Number);
                                                return new Time(h, m);
                                            })()
                                            : undefined
                                    }
                                    onChange={(time) =>
                                        formik.setFieldValue(
                                            "weekday_closing_time",
                                            time ? `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}` : ""
                                        )
                                    }
                                    className="w-full"
                                />
                                {formik.touched.weekday_closing_time && formik.errors.weekday_closing_time && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {formik.errors.weekday_closing_time as string}
                                    </div>
                                )}
                            </div>
                        </Grid>

                        <Grid>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Ground Opening Time (On Weekends)
                            </Label>
                            <div className="border border-gray-300 rounded-lg shadow-sm">
                                <TimeInput
                                    isRequired
                                    value={
                                        formik.values.weekend_opening_time
                                            ? (() => {
                                                const [h, m] = formik.values.weekend_opening_time.split(":").map(Number);
                                                return new Time(h, m);
                                            })()
                                            : undefined
                                    }
                                    onChange={(time) =>
                                        formik.setFieldValue(
                                            "weekend_opening_time",
                                            time ? `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}` : ""
                                        )
                                    }
                                    className="w-full"
                                />

                                {formik.touched.weekend_opening_time && formik.errors.weekend_opening_time && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {formik.errors.weekend_opening_time as string}
                                    </div>
                                )}
                            </div>
                        </Grid>

                        <Grid>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Ground Closing Time (On Weekdays)
                            </Label>
                            <div className="border border-gray-300 rounded-lg shadow-sm">
                                <TimeInput
                                    isRequired
                                    value={
                                        formik.values.weekend_closing_time
                                            ? (() => {
                                                const [h, m] = formik.values.weekend_closing_time.split(":").map(Number);
                                                return new Time(h, m);
                                            })()
                                            : undefined
                                    }
                                    onChange={(time) =>
                                        formik.setFieldValue(
                                            "weekend_closing_time",
                                            time ? `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}` : ""
                                        )
                                    }
                                    className="w-full"
                                />
                                {formik.touched.weekend_closing_time && formik.errors.weekend_closing_time && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {formik.errors.weekend_closing_time as string}
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
