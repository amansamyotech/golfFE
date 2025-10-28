import * as React from 'react';
import {
    Button,
    Grid,
    Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import DatePicker from '../form/date-picker';
import Select from '../form/Select';
import FileInput from '../form/input/FileInput';
import TextArea from '../form/input/TextArea';
import { ChevronDownIcon } from '@/icons';
import { addStaff, updateStaff } from '@/services/staffService';
import Image from 'next/image';

interface EmployeeData {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    staffProfileImg?: string;
    address?: string;
    jobTitle?: string;
    department?: string;
    employmentType?: string;
    dateOfJoining?: string;
    workShift?: string;
    salary?: number | string;
    profileImg ?: string;
}

interface AddEmployeeProps {
    open: boolean;
    handleClose: () => void;
    data?: EmployeeData;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    gender: Yup.string().required('Gender is required'),
    address: Yup.string().required('Address is required'),
    jobTitle: Yup.string().required('Job Title is required'),
    department: Yup.string().required('Department is required'),
    employmentType: Yup.string().required('Employment Type is required'),
    dateOfJoining: Yup.date().required('Date of joining is required'),
    workShift: Yup.string().required('Work shift is required'),
    salary: Yup.number().required('Salary is required').typeError('Must be a number'),
});

const AddEmployee: React.FC<AddEmployeeProps> = ({ open, handleClose, data }) => {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const options = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
    ];

    const employeTypeOptions = [
        { value: "full-time", label: "Full-Time" },
        { value: "part-time", label: "Part-Time" },
    ];

    const workShiftOptions = [
        { value: "morning", label: "Morning" },
        { value: "afternoon", label: "Afternoon" },
        { value: "evening", label: "Evening" },
    ];

    const formik = useFormik({
        initialValues: {
            name: data?.name || '',
            email: data?.email || '',
            phone: data?.phone || '',
            gender: data?.gender || '',
            staffProfileImg: data?.staffProfileImg || '',
            address: data?.address || '',
            jobTitle: data?.jobTitle || '',
            department: data?.department || '',
            employmentType: data?.employmentType || '',
            dateOfJoining: data?.dateOfJoining || '',
            workShift: data?.workShift || '',
            salary: data?.salary || '',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (data) {
                    await updateStaff(data?._id, values);
                } else {
                    await addStaff(values);
                }
            } catch (error) {
                console.error("Submission error:", error);
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
            formik.setFieldValue("staffProfileImg", file);
        }
    };

    useEffect(() => {
        if (data?.profileImg) {
            const imgPreviewUrl = `${process.env.NEXT_PUBLIC_API_IMG_URL}${data?.profileImg}`
            setImagePreview(imgPreviewUrl);
        }
    }, [data]);

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            className="max-w-[500px] p-6 lg:p-10"
        >
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold text-center flex-grow">
                    {data ? 'Edit Employee Information' : 'Add Employee Information'}
                </Typography>
                <ClearIcon onClick={handleClose} className="cursor-pointer" />
            </div>

            <form onSubmit={formik.handleSubmit}>
                <Grid>
                    <Grid>
                        <Label>Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Jeery"
                            className="w-full"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-400 text-xs ">{formik.errors.name}</div>
                        )}
                    </Grid>

                    <Grid>
                        <Label>Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="text"
                            placeholder="John Jeery"
                            className="w-full"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-400 text-xs ">{formik.errors.email}</div>
                        )}
                    </Grid>

                    <Grid>
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

                    <Grid>
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

                    <Grid>
                        <Label>Profile Image / Government ID</Label>
                        <FileInput onChange={handleFileChange} className="custom-class" />
                        {imagePreview && (
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                width={128}
                                height={128}
                                className="mt-2 object-cover rounded"
                            />
                        )}
                        {formik.touched.staffProfileImg && formik.errors.staffProfileImg && (
                            <div className="text-red-400 text-xs ">{formik.errors.staffProfileImg}</div>
                        )}
                    </Grid>

                    <Grid>
                        <Label>Address</Label>
                        <TextArea
                            id="address"
                            name="address"
                            placeholder="Enter Address"
                            value={formik.values.address}
                            onChange={(value) => formik.setFieldValue('address', value)}
                            onBlur={formik.handleBlur}
                            rows={2}
                        />
                        {formik.touched.address && formik.errors.address && (
                            <div className="text-red-400 text-xs ">{formik.errors.address}</div>
                        )}
                    </Grid>

                    <Grid>
                        <Label>Job Title / Designation</Label>
                        <Input
                            id="jobTitle"
                            name="jobTitle"
                            type="text"
                            placeholder="Caddy Manager"
                            className="w-full"
                            value={formik.values.jobTitle}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.jobTitle && formik.errors.jobTitle && (
                            <div className="text-red-400 text-xs ">{formik.errors.jobTitle}</div>
                        )}
                    </Grid>

                    <Grid>
                        <Label>Department</Label>
                        <Input
                            id="department"
                            name="department"
                            type="text"
                            placeholder="Management Department"
                            className="w-full"
                            value={formik.values.department}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.department && formik.errors.department && (
                            <div className="text-red-400 text-xs ">{formik.errors.department}</div>
                        )}
                    </Grid>

                    <Grid>
                        <Label>Employment Type</Label>
                        <div className="relative">
                            <Select
                                id="employmentType"
                                options={employeTypeOptions}
                                placeholder="Select an Employment Type"
                                value={formik.values.employmentType}
                                onChange={(option) => formik.setFieldValue("employmentType", option)}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                            {formik.touched.employmentType && formik.errors.employmentType && (
                                <div className="text-red-400 text-xs ">{formik.errors.employmentType}</div>
                            )}
                        </div>
                    </Grid>

                    <Grid>
                        <DatePicker
                            id="dateOfJoining"
                            label="Date of Joining"
                            placeholder="Select a Date of Joining"
                            defaultDate={formik.values.dateOfJoining}
                            onChange={(date) => formik.setFieldValue('dateOfJoining', date)}
                        />
                        {formik.touched.dateOfJoining && formik.errors.dateOfJoining && (
                            <div className="text-red-400 text-xs ">{formik.errors.dateOfJoining}</div>
                        )}
                    </Grid>

                    <Grid>
                        <Label>Work Shift</Label>
                        <div className="relative">
                            <Select
                                id="workShift"
                                options={workShiftOptions}
                                placeholder="Select an Work Shift"
                                value={formik.values.workShift}
                                onChange={(option) => formik.setFieldValue("workShift", option)}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                            {formik.touched.workShift && formik.errors.workShift && (
                                <div className="text-red-400 text-xs ">{formik.errors.workShift}</div>
                            )}
                        </div>
                    </Grid>

                    <Grid>
                        <Label>Salary</Label>
                        <Input
                            name="salary"
                            type="number"
                            placeholder="Enter Salary"
                            value={formik.values.salary}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.salary && formik.errors.salary && (
                            <div className="text-red-400 text-xs ">{formik.errors.salary}</div>
                        )}
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
                            setImagePreview(null);
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

export default AddEmployee;
