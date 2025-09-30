

import * as React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal } from '@/components/ui/modal';
import Label from '../form/Label';
import Select from '../form/Select';
import TextArea from '../form/input/TextArea';
import { ChevronDownIcon } from '@/icons';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from 'react';
import { getAllCustomer } from '@/services/customerService';
import { getAllCourses } from '@/services/courseService';
import { addBooking } from '@/services/bookingService';
import { getById } from '@/services/customerService';


interface Booking {
    _id: string;
    memberId?: string;
    course?: string;
    startDateTime: string;
    endDateTime: string;
    groupSize?: number | string;
    isCaddy?: boolean;
    specialInfo?: string;
}

interface TeeTimeBookingProps {
    open: boolean;
    handleClose: () => void;
    data: Booking | null;
}

interface Member {
    _id: string;
    name: string;
    startDate: string;
    expiryDate: string;
}

interface Course {
    _id: string;
    name: string;
}

const validationSchema = Yup.object({
    memberId: Yup.string().required('Member is required'),
    startDateTime: Yup.date().nullable().required('Start Date is required'),
    endDateTime: Yup.date()
        .nullable()
        .required('End Date is required')
        .min(Yup.ref('startDateTime'), 'End Date cannot be before Start Date'),
    course: Yup.string().
        required('Course is required'),
    isCaddy: Yup.boolean()
        .required('Caddy option is required'),
    specialInfo: Yup.string().max(500, 'Maximum 500 characters allowed'),
    // selectedSlot: Yup.object()
    //     .nullable()
    //     .required('Please select a time slot'),
});

const TeeTimeBooking: React.FC<TeeTimeBookingProps> = ({ open, handleClose, data }) => {
    const [members, setMembers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    // const [selectedSlot, setSelectedSlot] = useState<any>(null);


    const options = {
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
            memberId: data?.memberId || '',
            startDateTime: data?.startDateTime ? new Date(data.startDateTime) : null,
            endDateTime: data?.endDateTime ? new Date(data.endDateTime) : null,
            course: data?.course || '',
            isCaddy: data?.isCaddy || false,
            specialInfo: data?.specialInfo || '',
            // selectedSlot: data?.selectedSlot || null,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formattedValues = {
                    ...values,
                    customerId: values.memberId,
                    role: 'member'
                };
                await addBooking(formattedValues);
            } catch (error) {
                console.error('Error saving booking:', error);
            } finally {
                formik.resetForm();
                handleClose();
            }
        },
    });

    const fetchMembers = async () => {
        try {
            const fetchedMembers = await getAllCustomer();
            const formattedMembers = fetchedMembers
                .filter((member: Member) => member.role === "member")
                .map((member: Member) => ({
                    value: member._id,
                    label: member.name,
                }));


            setMembers(formattedMembers);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const fetchedCourses = await getAllCourses();
            const formattedCourses = fetchedCourses.map((course: Course) => ({
                value: course._id,
                label: course.name,
            }));
            setCourses(formattedCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleMemberChange = async (memberId: string) => {
        formik.setFieldValue('memberId', memberId);
        if (memberId) {
            try {
                const member = await getById(memberId);
                formik.setFieldValue('startDateTime', member.startDate ? new Date(member.startDate) : null);
                formik.setFieldValue('endDateTime', member.expiryDate ? new Date(member.expiryDate) : null);
            } catch (error) {
                console.error('Error fetching member details:', error);
                formik.setFieldValue('startDateTime', null);
                formik.setFieldValue('endDateTime', null);
            }
        } else {
            formik.setFieldValue('startDateTime', null);
            formik.setFieldValue('endDateTime', null);
        }
    };

    useEffect(() => {
        if (open) {
            fetchMembers();
            fetchCourses();
            if (data?.memberId) {
                handleMemberChange(data.memberId);
            }
        }
    }, [open, data]);

    const isMemberSelected = !!formik.values.memberId;

    // const handleCourseChange = async (option) => {
    //     if (option) {
    //         formik.setFieldValue('course', option);

    //         const startDate = formik.values.startDateTime
    //             ? formik.values.startDateTime.toISOString().split('T')[0]
    //             : null;
    //         const endDate = formik.values.endDateTime
    //             ? formik.values.endDateTime.toISOString().split('T')[0]
    //             : null;

    //         if (startDate) {
    //             try {
    //                 const slots = await getTimeSlotByStartAndCourse(startDate, endDate, option);
    //                 setAvailableSlots(slots);
    //             } catch (error) {
    //                 console.error('Error fetching available slots:', error);
    //                 setAvailableSlots([]);
    //             }
    //         } else {
    //             setAvailableSlots([]);
    //         }
    //     } else {
    //         formik.setFieldValue('course', '');
    //         setAvailableSlots([]);
    //     }
    // };

    const handleFormClose = () => {
        setAvailableSlots([]);
        formik.resetForm();
        handleClose();
    };

    const groupedSlots = availableSlots.reduce((acc, slot) => {
        const date = slot.start.split(" ")[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
    }, {});



    return (
        <Modal isOpen={open} onClose={handleFormClose} className="max-w-[600px] p-6">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold">
                    {data ? 'Edit Member Booking Information' : 'Add Member Booking Information'}
                </Typography>
                <ClearIcon onClick={handleFormClose} className="cursor-pointer" />
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
                                onChange={(option) => handleMemberChange(option || '')}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <ChevronDownIcon />
                            </span>
                            {formik.touched.memberId && formik.errors.memberId && (
                                <div className="text-red-400 text-xs">{formik.errors.memberId}</div>
                            )}
                        </div>
                    </Grid>

                    <Grid item xs={12}>
                        <Label>Start Date (MM-DD-YYYY)</Label>
                        <DatePicker
                            value={formik.values.startDateTime}
                            onChange={(val) => formik.setFieldValue('startDateTime', val)}
                            disabled={isMemberSelected}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: Boolean(formik.touched.startDateTime && formik.errors.startDateTime),
                                    helperText: formik.touched.startDateTime && formik.errors.startDateTime,
                                    readOnly: isMemberSelected,
                                    InputProps: {
                                        sx: { height: 42, backgroundColor: 'white', borderRadius: 2 },
                                    },
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Label>End Date (MM-DD-YYYY)</Label>
                        <DatePicker
                            value={formik.values.endDateTime}
                            onChange={(val) => formik.setFieldValue('endDateTime', val)}
                            disabled={isMemberSelected}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: Boolean(formik.touched.endDateTime && formik.errors.endDateTime),
                                    helperText: formik.touched.endDateTime && formik.errors.endDateTime,
                                    readOnly: isMemberSelected,
                                    InputProps: {
                                        sx: { height: 42, backgroundColor: 'white', borderRadius: 2 },
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
                                onChange={(option) => formik.setFieldValue('course', option)}
                                // onChange={(option) =>
                                //     handleCourseChange(option)
                                // }
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <ChevronDownIcon />
                            </span>
                            {formik.touched.course && formik.errors.course && (
                                <div className="text-red-400 text-xs">{formik.errors.course}</div>
                            )}
                        </div>
                    </Grid>

                    {/* <div className="mt-4">
                        <Label>Available Time Slots</Label>
                        <div className="max-h-[400px] overflow-y-auto border rounded-lg p-2 space-y-4">
                            {Object.keys(groupedSlots).map((date) => (
                                <div key={date} className="border-b pb-2">

                                    <div className="bg-gray-100 px-3 py-1 font-semibold text-sm sticky top-0">
                                        {date}
                                    </div>


                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {groupedSlots[date].map((slot) => (
                                            <div
                                                key={slot._id}
                                                onClick={() => {
                                                    if (slot.status === "available") {
                                                        formik.setFieldValue("selectedSlot", slot);
                                                        setSelectedSlot(slot);
                                                    }
                                                }}
                                                className={`px-3 py-1 rounded-md text-xs font-medium border cursor-pointer 
                ${selectedSlot?._id === slot._id
                                                        ? "bg-blue-200 border-blue-400"
                                                        : slot.status === "available"
                                                            ? "bg-green-100 text-green-800 border-green-300"
                                                            : "bg-red-100 text-red-800 border-red-300"
                                                    }`}
                                            >
                                                {slot.start.split(" ")[1]} - {slot.end.split(" ")[1]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    <Grid item xs={12}>
                        <Label>Need Caddy?</Label>
                        <div className="relative">
                            <Select
                                id="isCaddy"
                                options={options.caddy}
                                placeholder="Select Caddy Option"
                                value={formik.values.isCaddy}
                                onChange={(option) => formik.setFieldValue('isCaddy', option)}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <ChevronDownIcon />
                            </span>
                            {formik.touched.isCaddy && formik.errors.isCaddy && (
                                <div className="text-red-400 text-xs">{formik.errors.isCaddy}</div>
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
                            <div className="text-red-400 text-xs">{formik.errors.specialInfo}</div>
                        )}
                    </Grid>

                    <Grid item xs={12} className="flex justify-center mt-4 gap-4">
                        <Button type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleFormClose}>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Modal>
    );
};

export default TeeTimeBooking;
