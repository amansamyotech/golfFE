import * as React from 'react';
import {
    Button,
    Grid,
    Typography
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal } from '@/components/ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import DatePicker from '../form/date-picker';
import Select from '../form/Select';
import TextArea from '../form/input/TextArea';
import { ChevronDownIcon } from '@/icons';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getAllMember } from '@/services/memberService';
import { useEffect, useState } from 'react';
import { getAllCourses } from '@/services/courseService';
import { addBooking } from '@/services/bookingService';

interface TeeTimeBookingProps {
    open: boolean;
    handleClose: () => void;
    data: any;
}

const validationSchema = Yup.object({
    startDateTime: Yup.date().required('Start date and time is required'),
    endDateTime: Yup.date().required('End date and time is required'),
    course: Yup.string().required('Course is required'),
    groupSize: Yup.number().required('Group size is required').min(1, 'At least 1 member'),
    memberId: Yup.string().required('Member ID is required'),
    isCaddy: Yup.boolean().required(),
    specialInfo: Yup.string(),
});

const TeeTimeBooking: React.FC<TeeTimeBookingProps> = ({ open, handleClose, data }) => {
    const [members, setMembers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

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
            { value: true, label: 'Yes, Needs Caddy' },
            { value: false, label: 'No Caddy Needed' },
        ],


    };
    const formik = useFormik({
        initialValues: {
            startDateTime: data?.startDateTime || '',
            endDateTime: data?.endDateTime || '',
            course: data?.course || '',
            groupSize: data?.groupSize || '',
            memberId: data?.memberId || '',
            isCaddy: data?.isCaddy || false,
            specialInfo: data?.specialInfo || '',

        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            console.log('Submitted values:', values);
            setLoading(true);
            try {
                // console.log("Call API");
                // if (data) {
                //     await updateGuest(data?._id, values);
                // } else {
                //     await addGuest(values);
                // }
                await addBooking(values);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
                formik.resetForm();

                handleClose();
            }
        },
    });


    const fetchMembers = async () => {
        const fetchedMembers = await getAllMember();
        const formattedMembers = fetchedMembers.map((member: any) => ({
            value: member._id,
            label: member.name,
        }));
        setMembers(formattedMembers);
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
        fetchMembers();
        fetchCourses();
    }, [open]);



    return (
        <Modal isOpen={open} onClose={handleClose} className="max-w-[600px] p-6 lg:p-10">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold text-center flex-grow">
                    {data ? 'Edit Tee Time Booking' : 'Add Tee Time Booking'}
                </Typography>
                <ClearIcon onClick={handleClose} className="cursor-pointer" />
            </div>

            <form onSubmit={formik.handleSubmit}>
                <Grid>
                    <Grid item xs={12}>
                        <Label>Member</Label>
                        <div className="relative">
                            <Select
                                id="memberId"
                                options={members}
                                placeholder="Select Member"
                                value={formik.values.memberId}
                                onChange={(option) => formik.setFieldValue("memberId", option)}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                            {formik.touched.memberId && formik.errors.memberId && (
                                <div className="text-red-400 text-xs">{formik.errors.memberId}</div>
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
                        <Label>Need Caddy?</Label>
                        <div className="relative">
                            <Select
                                id="isCaddy"
                                options={options.caddy}
                                placeholder="Select Caddy Need"
                                value={formik.values.isCaddy}
                                onChange={(option) => formik.setFieldValue("isCaddy", option)}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                            {formik.touched.isCaddy && formik.errors.isCaddy && (
                                <div className="text-red-400 text-xs ">{formik.errors.isCaddy}</div>
                            )}
                        </div>
                    </Grid>

                    <Grid item xs={12}>
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
                            <div className="text-red-400 text-xs ">{formik.errors.specialInfo}</div>
                        )}
                    </Grid>

                    <div className="flex justify-center mt-6 gap-4">
                        <Button type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleClose}>
                            Cancel
                        </Button>
                    </div>
                </Grid>
            </form>
        </Modal >
    );
};

export default TeeTimeBooking;
