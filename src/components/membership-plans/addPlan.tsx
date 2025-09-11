import * as React from 'react';
import {
    Dialog,
    Button,
    Typography,
    Grid
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { Modal } from '@/components/ui/modal';
import { useState, useEffect } from 'react';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import FileInput from '../form/input/FileInput';
import TextArea from '../form/input/TextArea';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { addPlan, updatePlan } from '@/services/plansService';

interface AddPlansProps {
    open: boolean;
    handleClose: () => void;
    data: any;
}

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .required('Title is required')
        .max(100, 'Title cannot exceed 100 characters'),

    description: Yup.string()
        .required('Description is required')
        .max(1000, 'Description cannot exceed 1000 characters'),

    price: Yup.number()
        .typeError('Price must be a number')
        .required('Price is required')
        .min(0, 'Price must be greater than or equal to 0'),

    numberOfDays: Yup.number()
        .typeError('Number of days must be a number')
        .required('Number of days is required')
        .positive('Number of days must be greater than 0')
        .integer('Number of days must be an integer'),

    planImage: Yup.mixed()
        .required('Image is required')
});

const AddPlans: React.FC<AddPlansProps> = ({ open, handleClose, data }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            title: data?.title || '',
            description: data?.description || '',
            price: data?.price || '',
            numberOfDays: data?.numberOfDays || '',
            planImage: data?.planImage ? data.planImage.split('/').pop() : ''
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (data) {
                    await updatePlan(data?._id, values);
                } else {
                    await addPlan(values);
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error("Failed to add plan.");
            } finally {
                setLoading(false);
                handleClose();
                formik.resetForm();
                setImagePreview(null);
            }
        }
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            formik.setFieldValue('planImage', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (data?.planImage) {
            const imgPreviewUrl = `${process.env.NEXT_PUBLIC_API_IMG_URL}${data?.planImage}`
            setImagePreview(imgPreviewUrl);
        }
    }, [data]);

    return (
        <Modal isOpen={open} onClose={handleClose} className="max-w-[500px] p-6 lg:p-10">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-bold text-center flex-grow">
                        {data ? 'Edit Membership Plans Information' : 'Add Membership Plans Information'}
                    </Typography>
                    <ClearIcon onClick={handleClose} className="cursor-pointer" />
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <Grid>
                        <Grid item xs={12}>
                            <Label>Title</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="General Membership"
                                className="w-full"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <div className="text-red-400 text-xs ">{formik.errors.title}</div>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Label>Description</Label>
                            <TextArea
                                id="description"
                                name="description"
                                placeholder="Enter a brief description of the membership plan"
                                value={formik.values.description}
                                onChange={(value) => formik.setFieldValue('description', value)}
                                onBlur={formik.handleBlur}
                                rows={2}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <div className="text-red-400 text-xs ">{formik.errors.description}</div>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Label>Price</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                placeholder="Price"
                                className="w-full"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.price && formik.errors.price && (
                                <div className="text-red-400 text-xs ">{formik.errors.price}</div>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Label>Duration (In Number of Days)</Label>
                            <Input
                                id="numberOfDays"
                                name="numberOfDays"
                                type="number"
                                placeholder="e.g., 30"
                                className="w-full"
                                value={formik.values.numberOfDays}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.numberOfDays && formik.errors.numberOfDays && (
                                <div className="text-red-400 text-xs ">{formik.errors.numberOfDays}</div>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Label>Upload Image</Label>
                            <FileInput onChange={handleFileChange} className="custom-class" />
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
                            )}
                            {formik.touched.planImage && formik.errors.planImage && (
                                <div className="text-red-400 text-xs ">{formik.errors.planImage}</div>
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
            </div>
        </Modal>
    );
};

export default AddPlans;

