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
import TextArea from '../form/input/TextArea';
import { toast } from "react-toastify";
import { getAllPlan } from '@/services/plansService';
import { getAllCourses } from '@/services/courseService';
import { addMember, updateMember } from '@/services/memberService';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone must be 10 digits')
        .required('Phone is required'),
    dob: Yup.date().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
    image: Yup.mixed().nullable(),
    plan: Yup.string().required('Plan is required'),
    startDate: Yup.date().required('Start date is required'),

    teeTime: Yup.string().required('Tee time is required'),
    course: Yup.string().required('Course is required'),
    profileType: Yup.string().required('Profile type is required'),
});


const AddMember = ({ open, handleClose, data }: any) => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState([]);
    const [courses, setCourses] = useState([]);

    const formik = useFormik({
        initialValues: {
            name: data?.name || '',
            email: data?.email || '',
            phone: data?.phone || '',
            dob: data?.dob || '',
            gender: data?.gender || '',
            image: data?.image || '',
            plan: data?.plan._id || '',
            startDate: data?.startDate || '',
            teeTime: data?.teeTime || '',
            course: data?.course._id || '',
            profileType: data?.profileType || '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log("values :", values);
            setLoading(true);
            try {
                console.log("Call API");
                if (data) {
                    await updateMember(data._id, values);
                } else {
                    await addMember(values);
                }
            } catch (error) {
                console.error('Error:', error);
            }
            finally {
                setLoading(false);
                formik.resetForm();
                setImagePreview(null);
                handleClose();
            }
        }
    });


    const options = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
    ];

    const teeTimeOptions = [
        { value: "morning", label: "Morning" },
        { value: "afternoon", label: "Afternoon" },
        { value: "evening", label: "Evening" },
    ];

    const profileTypeOptions = [
        { value: "regular", label: "Regular" },
        { value: "vip", label: "VIP" },
        { value: "junior", label: "Junior" },
        { value: "senior", label: "Senior" },
    ];

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            formik.setFieldValue("image", file);
        }
    };

    const fetchPlans = async () => {
        const fetchedPlans = await getAllPlan();
        const formattedPlans = fetchedPlans.map((plan: any) => ({
            value: plan._id,
            label: plan.title,
            days: plan.numberOfDays,
        }));
        setPlans(formattedPlans);
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
        fetchPlans();
        fetchCourses();
    }, [open]);

    useEffect(() => {
        if (data?.image) {
            const imgPreviewUrl = `${process.env.NEXT_PUBLIC_API_IMG_URL}${data?.image}`
            setImagePreview(imgPreviewUrl);
        }
    }, [data]);

    // useEffect(() => {
    //     const selectedPlan = plans.find(p => p.value === formik.values.plan);
    //     console.log("---  selectedPlan :", selectedPlan);
    //     const startDate = formik.values.startDate;

    //     if (selectedPlan && startDate) {
    //         const duration = selectedPlan.days || 0;
    //         const newEndDate = new Date(startDate);
    //         newEndDate.setDate(newEndDate.getDate() + duration - 1);
    //     }
    // }, [formik.values.plan, formik.values.startDate]);


    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            className="max-w-[500px] p-6 lg:p-10"
        >
            <div>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-bold text-center flex-grow">
                        {data ? 'Edit Member Information' : 'Add Member Information'}
                    </Typography>
                    <ClearIcon onClick={handleClose} className="cursor-pointer" />
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <Grid >
                        <Grid item xs={12}>
                            <Label>Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                className="w-full"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-red-400 text-xs ">{formik.errors.name}</div>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Label>Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                placeholder="John@gmail.com"
                                className="w-full"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-400 text-xs ">{formik.errors.email}</div>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Label>Phone No</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="text"
                                placeholder="91-XXXXXXXXXX"
                                className="w-full"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <div className="text-red-400 text-xs ">{formik.errors.phone}</div>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <DatePicker
                                id="dob"
                                label="Date of Birth"
                                placeholder="Select a date"
                                defaultDate={formik.values.dob}
                                onChange={(date) => {
                                    console.log("date :", date);
                                    formik.setFieldValue('dob', date)
                                }}
                            />
                            {formik.touched.dob && formik.errors.dob && (
                                <div className="text-red-400 text-xs ">{formik.errors.dob}</div>
                            )}

                            {/* <Grid item xs={12}>
                                <DatePicker
                                    id="dob"
                                    label="Date of Birth"
                                    placeholder="Select a date"
                                    defaultDate={formik.values.dob ? new Date(formik.values.dob) : undefined}
                                    onChange={(selectedDates) => {
                                        const formattedDate = selectedDates[0]; // Already formatted as 'YYYY-MM-DD'
                                        console.log("formattedDate:", formattedDate);
                                        formik.setFieldValue('dob', formattedDate);
                                    }}
                                />
                                {formik.touched.dob && formik.errors.dob && (
                                    <div className="text-red-400 text-xs">{formik.errors.dob}</div>
                                )}
                            </Grid> */}
                        </Grid>

                        <Grid item xs={12}>
                            <Label>Gender</Label>
                            <div className="relative">
                                <Select
                                    id="gender"
                                    options={options}
                                    placeholder="Select an option"
                                    value={formik.values.gender}
                                    onChange={(option) => formik.setFieldValue("gender", option)}
                                    className="dark:bg-dark-900"
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                                {formik.touched.gender && formik.errors.gender && (
                                    <div className="text-red-400 text-xs ">{formik.errors.gender}</div>
                                )}
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <Label>Upload file</Label>
                            <FileInput onChange={handleFileChange} className="custom-class" />
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
                            )}
                            {formik.touched.image && formik.errors.image && (
                                <div className="text-red-400 text-xs ">{formik.errors.image}</div>
                            )}
                        </Grid>


                        <Grid item xs={12}>
                            <Label>Select Membership Plan</Label>
                            <div className="relative">
                                <Select
                                    id="plan"
                                    options={plans}
                                    placeholder="Select an option"
                                    value={formik.values.plan}
                                    onChange={(option) => formik.setFieldValue("plan", option)}
                                    className="dark:bg-dark-900"
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                                {formik.touched.plan && formik.errors.plan && (
                                    <div className="text-red-400 text-xs ">{formik.errors.plan}</div>
                                )}
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <DatePicker
                                id="startDate"
                                label="Start Date"
                                placeholder="Select a date"
                                defaultDate={formik.values.startDate}
                                onChange={(date) => formik.setFieldValue("startDate", date)}
                            />
                            {formik.touched.startDate && formik.errors.startDate && (
                                <div className="text-red-400 text-xs ">{formik.errors.startDate}</div>
                            )}
                        </Grid>



                        <Grid item xs={12}>
                            <Label>Select Preferred Tee Time</Label>
                            <div className="relative">
                                <Select
                                    id="teeTime"
                                    options={teeTimeOptions}
                                    placeholder="Select Preferred Time"
                                    value={formik.values.teeTime}
                                    onChange={(option) => formik.setFieldValue("teeTime", option)}
                                    className="dark:bg-dark-900"
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                                {formik.touched.teeTime && formik.errors.teeTime && (
                                    <div className="text-red-400 text-xs ">{formik.errors.teeTime}</div>
                                )}
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <Label>Select Course</Label>
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
                            <Label>Profile Type</Label>
                            <div className="relative">
                                <Select
                                    id="profileType"
                                    options={profileTypeOptions}
                                    placeholder="Select Profile Type"
                                    value={formik.values.profileType}
                                    onChange={(option) => formik.setFieldValue("profileType", option)}
                                    className="dark:bg-dark-900"
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                                {formik.touched.profileType && formik.errors.profileType && (
                                    <div className="text-red-400 text-xs ">{formik.errors.profileType}</div>
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
}

export default AddMember;


