import * as React from 'react';
import {
    Button,
    Grid,
    Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { Modal } from '@/components/ui/modal';
import { useState, useEffect } from 'react';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import { ChevronDownIcon } from '@/icons';
import FileInput from '../form/input/FileInput';
import { getAllCourses } from '@/services/courseService';
import * as Yup from 'yup';
import DatePicker from '../form/date-picker';
import Image from 'next/image';
import TextArea from '../form/input/TextArea';
import { getTimeSlotByStartAndCourse } from '@/services/timeslotService';
import { guestBooking } from '@/services/bookingService';
import { updateGuestBooking } from '@/services/bookingService';

interface GuestBookingData {
    // _id?: string;
    // name?: string;
    // email?: string;
    // phone?: string;
    // govId?: string;
    // groupSize: any;
    // startDateTime?: string;
    // caddyCart?: any;
    // amount?: number | any;
    // paymentMode?: string;
    // acceptRules?: boolean | any;
    // acknowledgePolicy?: boolean | any;
    // startTime?: string;
    // specialInfo?: string;
    // customerId?: {
    //     name?: string;
    //     email?: string;
    //     phone?: string;
    //     govId?: string;
    //     role?: string;
    //     startTime?: string;
    // }
    // course: { _id: string; name: string };
    // selectedSlot?: { start: string; end: string; status: string };
    // slot: any;

    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    govId?: string;
    groupSize?: number | any;
    startDateTime?: string;
    caddyCart?: any;
    amount?: number | any;
    paymentMode?: string;
    acceptRules?: boolean | any;
    acknowledgePolicy?: boolean | any;
    startTime?: string;
    specialInfo?: string;
    customerId?: {
        _id?: string;
        name?: string;
        email?: string;
        phone?: string;
        role?: string;
        startDate?: string;
        govId?: string;
    };
    course: { _id: string; name: string };
    selectedSlot?: { start: string; end: string; status?: string };
    slot?: any;
}
interface Course {
    _id: string;
    name: string;
}
interface AddGuestBookingsProps {
    open: boolean;
    handleClose: () => void;
    data?: GuestBookingData;
}


const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
        .matches(/^\+?[0-9]{7,15}$/, 'Invalid phone number')
        .required('Phone number is required'),
    govId: Yup.mixed().nullable(),
    course: Yup.string().required('Course is required'),
    bookingDate: Yup.date().required('Booking date is required'),
    groupSize: Yup.string().required('Group size is required'),
    caddyCart: Yup.boolean().required('Caddy/Cart selection is required'),
    specialInfo: Yup.string(),
    amount: Yup.number()
        .typeError('Amount must be a number')
        .required('Amount is required')
        .min(0, 'Amount must be positive'),
    paymentMode: Yup.string().required('Payment mode is required'),
    acceptRules: Yup.boolean()
        .oneOf([true], 'You must accept the rules'),
    acknowledgePolicy: Yup.boolean()
        .oneOf([true], 'You must acknowledge the policy'),
    selectedSlot: Yup.object().nullable()
});

const AddGuestBookings: React.FC<AddGuestBookingsProps> = ({ open, handleClose, data }) => {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [courses, setCourses] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);

    const formik = useFormik({
        initialValues: {
            name: data?.customerId?.name || '',
            email: data?.customerId?.email || '',
            phone: data?.customerId?.phone || '',
            govId: data?.customerId?.govId || '',
            course: data?.course._id || '',
            bookingDate: data?.startTime || '',
            groupSize: data?.groupSize || '',
            caddyCart: data?.caddyCart || false,
            specialInfo: data?.specialInfo || '',
            amount: data?.amount || '',
            paymentMode: data?.paymentMode || '',
            acceptRules: data?.acceptRules || false,
            acknowledgePolicy: data?.acknowledgePolicy || false,
            selectedSlot: data?.selectedSlot || null,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('role', 'guest');
                formData.append('name', values.name);
                formData.append('email', values.email);
                formData.append('phone', values.phone);
                formData.append('govId', values.govId);
                formData.append('course', values.course);
                formData.append('bookingDate', Array.isArray(values.bookingDate) ? values.bookingDate[0] : values.bookingDate);
                formData.append('groupSize', values.groupSize);
                formData.append('caddyCart', values.caddyCart);
                formData.append('specialInfo', values.specialInfo);
                formData.append('amount', values.amount);
                formData.append('paymentMode', values.paymentMode);
                formData.append('acceptRules', values.acceptRules);
                formData.append('acknowledgePolicy', values.acknowledgePolicy);
                formData.append('selectedSlot', JSON.stringify(values.selectedSlot));

                // await guestBooking(formData);
                if (data) {
                    await updateGuestBooking(data._id, formData as unknown as GuestBookingData);
                } else {
                    await guestBooking(formData as unknown as GuestBookingData);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
                formik.resetForm();
                handleClose();
                setImagePreview(null)
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
        if (data?.customerId?.govId) {
            const imgPreviewUrl = `${process.env.NEXT_PUBLIC_API_IMG_URL}${data?.customerId?.govId}`
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
            { value: "true", label: 'Yes, Needs Caddy' },
            { value: "false", label: 'No Caddy Needed' },
        ],
        payments: [
            { value: 'card', label: 'Card' },
            { value: 'upi', label: 'UPI' },
            { value: 'cash', label: 'Cash' },
        ],
    };

    const fetchCourses = async () => {
        const fetchedCourses = await getAllCourses() as any[];
        const formattedCourses = fetchedCourses.map((course: Course) => ({
            value: course._id,
            label: course.name,
        }));
        setCourses(formattedCourses);
    };

    useEffect(() => {
        fetchCourses();
    }, [open]);

    // useEffect(() => {
    //     const bookingDateObj = formik.values.bookingDate
    //         ? new Date(formik.values.bookingDate)
    //         : null;

    //     const isValidDate = bookingDateObj && !isNaN(bookingDateObj.getTime());

    //     const startDate = isValidDate
    //         ? bookingDateObj.toISOString().split('T')[0]
    //         : null;

    //     const endDate = startDate;

    //     if (startDate && formik.values.course) {
    //         const fetchSlots = async () => {
    //             try {
    //                 const slots = await getTimeSlotByStartAndCourse(
    //                     startDate,
    //                     endDate,
    //                     formik.values.course.value || formik.values.course
    //                 );
    //                 setAvailableSlots(slots);
    //             } catch (error) {
    //                 console.error('Error fetching available slots:', error);
    //                 setAvailableSlots([]);
    //             }
    //         };
    //         fetchSlots();
    //     } else {
    //         setAvailableSlots([]);
    //     }
    // }, [formik.values.bookingDate, formik.values.course]);



    const handleFormClose = () => {
        setAvailableSlots([]);
        formik.resetForm();
        setSelectedSlot(null);
        handleClose();
        setImagePreview(null);
    };

    useEffect(() => {
        console.log('Current Formik errors:', formik.errors);
    }, [formik.errors]);

    return (
        <Modal isOpen={open} onClose={handleFormClose} className="max-w-[500px] p-6 lg:p-10">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold text-center flex-grow">
                    {data ? 'Edit Guest Booking Information' : 'Add Guest Booking Information'}
                </Typography>
                <ClearIcon onClick={handleFormClose} className="cursor-pointer" />
            </div>

            <form onSubmit={formik.handleSubmit}>
                {/* Personal Info */}
                <h2 className="text-md font-semibold my-2">Personal Information</h2>
                <Grid>
                    <Label>Name</Label>
                    <Input
                        name="name"
                        placeholder="Full Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}

                    />
                    {formik.touched.name && formik.errors.name && (
                        <div className="text-red-400 text-xs ">{formik.errors.name}</div>
                    )}
                </Grid>

                <Grid>
                    <Label>Email</Label>
                    <Input
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

                <Grid>
                    <Label>Phone No</Label>
                    <Input
                        name="phone"
                        placeholder="Phone Number"
                        value={formik.values.phone}
                        onChange={formik.handleChange}

                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <div className="text-red-400 text-xs ">{formik.errors.phone}</div>
                    )}
                </Grid>

                <Grid>
                    <Label>Upload Goverment Id </Label>
                    <FileInput onChange={handleFileChange} className="custom-class" />
                    {imagePreview && (
                        <div className="mt-2 w-32 h-32 relative">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                layout="fill"
                                objectFit="cover"
                                className="rounded"
                            />
                        </div>
                    )}
                    {formik.touched.govId && formik.errors.govId && (
                        <div className="text-red-400 text-xs ">{formik.errors.govId}</div>
                    )}
                </Grid>

                {/* Tee Time */}
                <h2 className="text-md font-semibold my-2">Tee Time Details</h2>
                <Grid>
                    <DatePicker
                        id="bookingDate"
                        label="Date"
                        placeholder="Select Booking Date"
                        defaultDate={formik.values.bookingDate}
                        onChange={(date) => formik.setFieldValue('bookingDate', date)}
                    />
                    {formik.touched.bookingDate && formik.errors.bookingDate && (
                        <div className="text-red-400 text-xs ">{formik.errors.bookingDate}</div>
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
                            onChange={(option) => formik.setFieldValue('course', option)}
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

                <Grid>
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
                        {formik.touched.groupSize && typeof formik.errors.groupSize === 'string' && (
                            <div className="text-red-400 text-xs ">{formik.errors.groupSize}</div>
                        )}
                    </div>
                </Grid>

                <Grid>
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
                        {formik.touched.caddyCart && typeof formik.errors.caddyCart === 'string' && (
                            <div className="text-red-400 text-xs ">{formik.errors.caddyCart}</div>
                        )}
                    </div>
                </Grid>

                <Grid>
                    <Label>Special Info</Label>
                    <TextArea
                        id="specialInfo"
                        name="specialInfo"
                        placeholder="Any additional instructions..."
                        value={formik.values.specialInfo}
                        onChange={(value) => formik.setFieldValue('specialInfo', value)}
                        onBlur={formik.handleBlur}
                        rows={2}
                    />
                    {formik.touched.specialInfo && formik.errors.specialInfo && (
                        <div className="text-red-400 text-xs">{formik.errors.specialInfo}</div>
                    )}
                </Grid>

                {/* Payment */}
                <h2 className="text-md font-semibold my-2">Payment Info</h2>
                <Grid>
                    <Label>Amount</Label>
                    <Input
                        name="amount"
                        type="number"
                        placeholder="Amount"
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.amount && typeof formik.errors.amount === 'string' && (
                        <div className="text-red-400 text-xs ">{formik.errors.amount}</div>
                    )}
                </Grid>

                <Grid>
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
                    {formik.touched.acceptRules && typeof formik.errors.acceptRules === 'string' && (
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
                    {formik.touched.acknowledgePolicy && typeof formik.errors.acknowledgePolicy === 'string' && (
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