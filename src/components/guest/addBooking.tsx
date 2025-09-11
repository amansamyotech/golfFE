import * as React from 'react';
import {
    Dialog,
    Button,
    FormHelperText,
    FormLabel,
    Grid,
    DialogContent,
    DialogTitle,
    Typography,
    DialogActions,
    TextField
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useState, useEffect } from 'react';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import DatePicker from '../form/date-picker';
import Select from '../form/Select';
import { ChevronDownIcon } from '@/icons';
import FileInput from '../form/input/FileInput';
import { toast } from "react-toastify";
import { getAllCourses } from '@/services/courseService';
import { addGuest, updateGuest } from '@/services/guestService';
import * as Yup from 'yup';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
        .matches(/^\+?[0-9]{7,15}$/, 'Invalid phone number')
        .required('Phone number is required'),
    govId: Yup.mixed().required('Government ID is required'),
    course: Yup.string().required('Course is required'),
    groupSize: Yup.number()
        .required('Group size is required'),
    caddyCart: Yup.string().required('Caddy/Cart selection is required'),
    amount: Yup.number()
        .typeError('Amount must be a number')
        .required('Amount is required')
        .min(0, 'Amount must be a positive number'),
    paymentMode: Yup.string().required('Payment mode is required'),
    acceptRules: Yup.boolean()
        .oneOf([true], 'You must accept the rules'),
    acknowledgePolicy: Yup.boolean()
        .oneOf([true], 'You must acknowledge the policy'),
});

const AddGuestBookings = ({ open, handleClose, data }: any) => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [courses, setCourses] = useState([]);

    const formik = useFormik({
        initialValues: {
            name: data?.name || '',
            email: data?.email || '',
            phone: data?.phone || '',
            govId: data?.govId || '',
            course: data?.course._id || '',
            startDateTime: data?.startDateTime || '',
            endDateTime: data?.endDateTime || '',
            groupSize: data?.groupSize || '',
            caddyCart: data?.caddyCart || false,
            amount: data?.amount || '',
            paymentMode: data?.paymentMode || '',
            acceptRules: data?.acceptRules || false,
            acknowledgePolicy: data?.acknowledgePolicy || false,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log('Submitted values:', values);
            setLoading(true);
            try {
                console.log("Call API");
                if (data) {
                    await updateGuest(data?._id, values);
                } else {
                    await addGuest(values);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
                formik.resetForm();
                setImagePreview(null);
                handleClose();
            }
        },
    });

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            formik.setFieldValue('govId', file);
        }
    };

    useEffect(() => {
        if (data?.govId) {
            const imgPreviewUrl = `${process.env.NEXT_PUBLIC_API_IMG_URL}${data?.govId}`
            setImagePreview(imgPreviewUrl);
        }
    }, [data]);

    const options = {
        courses: [
            { value: 'COUR101', label: 'COUR101' },
            { value: 'COUR102', label: 'COUR102' },
            { value: 'COUR103', label: 'COUR103' },
        ],
        groupSizes: [
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
        ],
        caddy: [
            { value: true, label: 'Assign' },
            { value: false, label: 'Not Assign' },
        ],
        payments: [
            { value: 'card', label: 'Card' },
            { value: 'upi', label: 'UPI' },
            { value: 'cash', label: 'Cash' },
        ],
    };

    const fetchCourses = async () => {
        const fetchedCourses = await getAllCourses();
        const formattedCourses = fetchedCourses.map((course: any) => ({
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

            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold text-center flex-grow">
                    {data ? 'Edit Guest Booking Information' : 'Add Guest Booking Information'}
                </Typography>
                <ClearIcon onClick={handleClose} className="cursor-pointer" />
            </div>

            <form onSubmit={formik.handleSubmit}>
                {/* Personal Info */}
                <h2 className="text-md font-semibold my-2">Personal Information</h2>
                <Grid item xs={12}>
                    <Label>Name</Label>
                    <Input
                        fullWidth
                        name="name"
                        placeholder="Full Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}

                    />
                    {formik.touched.name && formik.errors.name && (
                        <div className="text-red-400 text-xs ">{formik.errors.name}</div>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <Label>Email</Label>
                    <Input
                        fullWidth
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}

                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="text-red-400 text-xs ">{formik.errors.email}</div>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <Label>Phone No</Label>
                    <Input
                        fullWidth
                        name="phone"
                        placeholder="Phone Number"
                        value={formik.values.phone}
                        onChange={formik.handleChange}

                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <div className="text-red-400 text-xs ">{formik.errors.phone}</div>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <Label>Upload Goverment Id </Label>
                    <FileInput onChange={handleFileChange} className="custom-class" />
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
                    )}
                    {formik.touched.govId && formik.errors.govId && (
                        <div className="text-red-400 text-xs ">{formik.errors.govId}</div>
                    )}
                </Grid>

                {/* Tee Time */}
                <h2 className="text-md font-semibold my-2">Tee Time Details</h2>

                <Grid item xs={12}>
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
                            <div className="text-red-400 text-xs ">{formik.errors.course}</div>
                        )}
                    </div>
                </Grid>


                <Grid item xs={12}>
                    <Label>Group Size</Label>
                    <div className="relative">
                        <Select
                            id="groupSize"
                            options={options.groupSizes}
                            placeholder="Group Size"
                            value={formik.values.groupSize}
                            onChange={(option) => formik.setFieldValue("groupSize", option)}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                        {formik.touched.groupSize && formik.errors.groupSize && (
                            <div className="text-red-400 text-xs ">{formik.errors.groupSize}</div>
                        )}
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <Label>Assign Caddy</Label>
                    <div className="relative">
                        <Select
                            id="caddyCart"
                            options={options.caddy}
                            placeholder="Assign Caddy"
                            value={formik.values.caddyCart}
                            onChange={(option) => formik.setFieldValue("caddyCart", option)}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                        {formik.touched.caddyCart && formik.errors.caddyCart && (
                            <div className="text-red-400 text-xs ">{formik.errors.caddyCart}</div>
                        )}
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <Label>Start Date & Time</Label>
                    <DateTimePicker
                        value={formik.values.startDateTime}
                        onChange={(val) => formik.setFieldValue('startDateTime', val)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: Boolean(formik.touched.startDateTime && formik.errors.startDateTime),
                                helperText: formik.touched.startDateTime && formik.errors.startDateTime,
                                InputProps: {
                                    sx: {
                                        height: 42,
                                        backgroundColor: 'white',
                                        borderRadius: 2,
                                        paddingX: 1,
                                        fontSize: 14,
                                        '&:focus-within': {
                                            borderColor: 'brand-500',
                                            boxShadow: '0 0 0 3px rgba(59,130,246,0.1)',
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Label>End Date & Time</Label>
                    <DateTimePicker
                        value={formik.values.endDateTime}
                        onChange={(val) => formik.setFieldValue('endDateTime', val)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: Boolean(formik.touched.endDateTime && formik.errors.endDateTime),
                                helperText: formik.touched.endDateTime && formik.errors.endDateTime,
                                InputProps: {
                                    sx: {
                                        height: 42,
                                        backgroundColor: 'white',
                                        borderRadius: 2,
                                        paddingX: 1,
                                        fontSize: 14,
                                        '&:focus-within': {
                                            borderColor: 'brand-500',
                                            boxShadow: '0 0 0 3px rgba(59,130,246,0.1)',
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </Grid>

                {/* Payment */}
                <h2 className="text-md font-semibold my-2">Payment Info</h2>

                <Grid item xs={12}>
                    <Label>Amount</Label>
                    <Input
                        fullWidth
                        name="amount"
                        type="number"
                        placeholder="Amount"
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.amount && formik.errors.amount && (
                        <div className="text-red-400 text-xs ">{formik.errors.amount}</div>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <Label>Payment Mode</Label>
                    <div className="relative">
                        <Select
                            id="paymentMode"
                            options={options.payments}
                            placeholder="Payment Mode"
                            value={formik.values.paymentMode}
                            onChange={(option) => formik.setFieldValue("paymentMode", option)}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                        {formik.touched.paymentMode && formik.errors.paymentMode && (
                            <div className="text-red-400 text-xs ">{formik.errors.paymentMode}</div>
                        )}
                    </div>
                </Grid>

                {/* Terms */}
                <div className="mt-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="acceptRules"
                            checked={formik.values.acceptRules}
                            onChange={formik.handleChange}
                        />
                        Accept rules of conduct
                    </label>
                    {formik.touched.acceptRules && formik.errors.acceptRules && (
                        <div className="text-red-400 text-xs">{formik.errors.acceptRules}</div>
                    )}

                    <label className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            name="acknowledgePolicy"
                            checked={formik.values.acknowledgePolicy}
                            onChange={formik.handleChange}
                        />
                        Acknowledge cancellation policy
                    </label>
                    {formik.touched.acknowledgePolicy && formik.errors.acknowledgePolicy && (
                        <div className="text-red-400 text-xs">{formik.errors.acknowledgePolicy}</div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
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

        </Modal>
    );
};

export default AddGuestBookings;