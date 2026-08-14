import * as React from 'react';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    Typography,
    Grid,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Modal } from '@/components/ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { toast } from 'react-toastify';
import Select from '../form/Select';
import { ChevronDownIcon } from '@/icons';
import FileInput from '../form/input/FileInput';
import Image from 'next/image';
import { addPlayer, updatePlayer } from '@/services/playersService';

// ✅ Validation schema for Player
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(100, 'Name cannot exceed 100 characters'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().max(10, 'Phone cannot exceed 10 digits'),
    age: Yup.number().positive('Age must be positive').integer('Age must be an integer'),
    gender: Yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
    profileImage: Yup.mixed().nullable(),
});

const AddPlayer = ({ open, handleClose, data }) => {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
    ];

    const formik = useFormik({
        initialValues: {
            name: data?.name || '',
            email: data?.email || '',
            phone: data?.phone || '',
            age: data?.age || '',
            gender: data?.gender || '',
            profileImage: data?.profileImage || '',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {

            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('email', values.email);
                formData.append('phone', values.phone);
                formData.append('age', values.age);
                formData.append('gender', values.gender);
                if (values.profileImage) formData.append('profileImage', values.profileImage);

                if (data?._id) {
                    await updatePlayer(data?._id, formData);
                } else {
                    await addPlayer(formData);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to save player.');
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
            formik.setFieldValue('profileImage', file);
        }
    };

    useEffect(() => {
        if (data?.profileImage) {
            const imgPreviewUrl = `${process.env.NEXT_PUBLIC_API_IMG_URL}${data?.profileImage}`
            setImagePreview(imgPreviewUrl);
        }
    }, [data]);

    return (
        <Modal isOpen={open} onClose={handleClose} className="max-w-[600px] p-6 lg:p-10">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-bold flex-grow text-center">
                        {data ? 'Edit Player Details' : 'Add Player Details'}
                    </Typography>
                    <ClearIcon onClick={handleClose} className="cursor-pointer" />
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <Grid>
                        <Grid>
                            <Label>Name</Label>
                            <Input
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Player Name"
                                className="w-full"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-red-500 text-xs">{formik.errors.name as string}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Email</Label>
                            <Input
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Player Email"
                                className="w-full"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-xs">{formik.errors.email as string}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Phone</Label>
                            <Input
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Player Phone"
                                className="w-full"
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <div className="text-red-500 text-xs">{formik.errors.phone as string}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Age</Label>
                            <Input
                                type="number"
                                name="age"
                                value={formik.values.age}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Player Age"
                                className="w-full"
                            />
                            {formik.touched.age && formik.errors.age && (
                                <div className="text-red-500 text-xs">{formik.errors.age as string}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Gender</Label>
                            <div className="relative">
                                <Select
                                    id="gender"
                                    options={genderOptions}
                                    placeholder="Select Gender"
                                    value={formik.values.gender}
                                    onChange={(option) => formik.setFieldValue('gender', option)}
                                    className="dark:bg-dark-900"
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                            {formik.touched.gender && formik.errors.gender && (
                                <div className="text-red-500 text-xs">{formik.errors.gender as string}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Profile Image (URL)</Label>
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
                            {formik.touched.profileImage && formik.errors.profileImage && (
                                <div className="text-red-400 text-xs ">{formik.errors.profileImage as string}</div>
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

export default AddPlayer;

