import * as React from 'react';
import {
    Button,
    FormHelperText,
    FormLabel,
    Grid,
    Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { Modal } from '@/components/ui/modal';
import { useState, useEffect } from 'react';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import DatePicker from '../form/date-picker';
import Select from '../form/Select';
import { ChevronDownIcon } from '@/icons';
import FileInput from '../form/input/FileInput';
import TextArea from '../form/input/TextArea';
import { addCourse, updateCourse } from '@/services/courseService';
import * as Yup from 'yup';

interface AddCourseProps {
    open: boolean;
    handleClose: () => void;
    data: any;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Course name is required'),
    courseNumber: Yup.string().required('Course number is required'),
    holes: Yup.number()
        .required('Number of holes is required')
        .typeError('Must be a number'),
    // .oneOf([9, 18], 'Number of holes must be either 9 or 18'),
    location: Yup.string().required('Location is required'),
});

const AddCourse: React.FC<AddCourseProps> = ({ open, handleClose, data }) => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: data?.name || '',
            courseNumber: data?.courseNumber || '',
            holes: data?.holes || '',
            location: data?.location || '',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            console.log("values:", values);
            setLoading(true);
            try {
                console.log("Calling API...");
                if (data) {
                    await updateCourse(data?._id, values);
                } else {
                    await addCourse(values);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
                formik.resetForm();
                handleClose();
            }
        },
    });



    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            className="max-w-[500px] p-6 lg:p-10"
        >
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold text-center flex-grow">
                    {data ? 'Edit Course Information ' : ' Add Course Information '}
                </Typography>
                <ClearIcon onClick={handleClose} className="cursor-pointer" />
            </div>

            <form onSubmit={formik.handleSubmit}>
                <Grid >
                    <Grid item xs={12}>
                        <Label>Course Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Green Valley Golf Club"
                            fullWidth
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-400 text-xs ">{formik.errors.name}</div>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Label>Course Number</Label>
                        <Input
                            id="courseNumber"
                            name="courseNumber"
                            type="text"
                            placeholder="A101"
                            fullWidth
                            value={formik.values.courseNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.courseNumber && formik.errors.courseNumber && (
                            <div className="text-red-400 text-xs ">{formik.errors.courseNumber}</div>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Label>Number of Holes</Label>
                        <Input
                            id="holes"
                            name="holes"
                            type="number"
                            placeholder="e.g. 18"
                            fullWidth
                            value={formik.values.holes}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.holes && formik.errors.holes && (
                            <div className="text-red-400 text-xs ">{formik.errors.holes}</div>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Label>Location</Label>
                        <Input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="Los Angeles, CA"
                            fullWidth
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.location && formik.errors.location && (
                            <div className="text-red-400 text-xs ">{formik.errors.location}</div>
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

        </Modal>
    );
};

export default AddCourse;
