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
import TextArea from '../form/input/TextArea';
import { toast } from 'react-toastify';
import Select from '../form/Select';
import { ChevronDownIcon } from '@/icons';
import { getAllCourses } from '@/services/courseService';
import { addTournament, updateTournament } from '@/services/tournamentService';
import DatePicker from '../form/date-picker';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(100, 'Name cannot exceed 100 characters'),
    description: Yup.string().max(1000, 'Description cannot exceed 1000 characters'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date cannot be before start date'),
    location: Yup.string().max(100, 'Location cannot exceed 100 characters'),
    format: Yup.string().oneOf(['stroke', 'match', 'stableford']).required('Format is required'),
    course: Yup.string().required('Course is required'),
    participantsPlay: Yup.number().required("No of participants paly in this tournament")
});

const AddTournament = ({ open, handleClose, data }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const options = {
        format: [
            { value: 'stroke', label: 'Stroke' },
            { value: 'match', label: 'Match' },
            { value: 'stableford', label: 'Stableford' },
        ],
    };

    const fetchCourses = async () => {
        const fetchedCourses = await getAllCourses() as any[];
        const formattedCourses = fetchedCourses.map((course) => ({
            value: course._id,
            label: course.name,
        }));
        setCourses(formattedCourses);
    };

    useEffect(() => {
        fetchCourses();
    }, [open]);

    const formik = useFormik({
        initialValues: {
            name: data?.name || '',
            description: data?.description || '',
            // startDate: data?.startDate ? new Date(data.startDate).toISOString().substring(0, 10) : '',
            // endDate: data?.endDate ? new Date(data.endDate).toISOString().substring(0, 10) : '',
            startDate: data?.startDate
                ? new Date(data.startDate).toLocaleDateString('en-CA')
                : '',
            endDate: data?.endDate
                ? new Date(data.endDate).toLocaleDateString('en-CA')
                : '',
            location: data?.location || '',
            format: data?.format || '',
            course: data?.course?._id || '',
            participantsPlay: data?.participantsPlay || ''
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (data?._id) {
                    await updateTournament(data._id, values);
                } else {
                    await addTournament(values);
                }
                handleClose();
                formik.resetForm();
            } catch (err) {
                console.error(err);
                toast.error('Failed to save tournament.');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <Modal isOpen={open} onClose={handleClose} className="max-w-[600px] p-6 lg:p-10">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-bold flex-grow text-center">
                        {data ? 'Edit Tournament Details' : 'Add Tournament Details'}
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
                                placeholder="Tournament Name"
                                className="w-full"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-red-500 text-xs">{formik.errors.name as string}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Description</Label>
                            <TextArea
                                id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={(value) => formik.setFieldValue('description', value)}
                                placeholder="Tournament description"
                                rows={3}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <div className="text-red-500 text-xs">{formik.errors.description as string}</div>
                            )}
                        </Grid>

                        <Grid>
                            <DatePicker
                                id="startDate"
                                label="Start Date"
                                placeholder="Select Start Date"
                                minDate='today'
                                defaultDate={formik.values.startDate}
                                // onChange={(date) => {
                                //     formik.setFieldValue('startDate', date)
                                // }}
                                onChange={(date) => {
                                    const localDate = new Date(date).toLocaleDateString('en-CA');
                                    formik.setFieldValue('startDate', localDate);
                                }}
                            />
                            {formik.touched.startDate && formik.errors.startDate && (
                                <div className="text-red-500 text-xs">{formik.errors.startDate}</div>
                            )}
                        </Grid>



                        <Grid>
                            <DatePicker
                                id="endDate"
                                label="End Date"
                                placeholder="Select End Date"
                                minDate='today'
                                defaultDate={formik.values.endDate}
                                // onChange={(date) => {
                                //     formik.setFieldValue('endDate', date)
                                // }}
                                onChange={(date) => {
                                    const localDate = new Date(date).toLocaleDateString('en-CA');
                                    formik.setFieldValue('endDate', localDate);
                                }}
                            />
                            {formik.touched.endDate && formik.errors.endDate && (
                                <div className="text-red-500 text-xs">{formik.errors.endDate}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Location</Label>
                            <Input
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Tournament location"
                                className="w-full"
                            />
                            {formik.touched.location && formik.errors.location && (
                                <div className="text-red-500 text-xs">{formik.errors.location as string}</div>
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
                                    <div className="text-red-500 text-xs">{formik.errors.course as string}</div>
                                )}
                            </div>
                        </Grid>

                        <Grid>
                            <Label>Participants Require</Label>
                            <Input
                                type="number"
                                name="participantsPlay"
                                value={formik.values.participantsPlay}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="How many participants play in the tournament"
                                className="w-full"
                            />
                            {formik.touched.participantsPlay && formik.errors.participantsPlay && (
                                <div className="text-red-500 text-xs">{formik.errors.participantsPlay as string}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Format</Label>
                            <div className="relative">
                                <Select
                                    id="format"
                                    options={options.format}
                                    placeholder="Select Format"
                                    value={formik.values.format}
                                    // onChange={formik.handleChange}
                                    onChange={(option) => formik.setFieldValue("format", option)}
                                    className="dark:bg-dark-900"
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                                {formik.touched.format && formik.errors.format && (
                                    <div className="text-red-500 text-xs">{formik.errors.format as string}</div>
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

export default AddTournament;
