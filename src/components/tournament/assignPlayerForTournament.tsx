import * as React from 'react';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Typography, Grid, CircularProgress } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Modal } from '@/components/ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { toast } from 'react-toastify';
import { getPlayerByNumber } from '@/services/playersService';
import { assignPlayerToTheTournament } from '@/services/tournamentService';

const AssignPlayerToTournament = ({ open, handleClose, data }) => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            phone: Yup.string()
                .required('Phone is required')
                .matches(/^[0-9]{10}$/, 'Phone must be exactly 10 digits'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await assignPlayerToTheTournament(data?._id, values);
            } catch (error) {
                toast.error('Failed to assign player.');
            } finally {
                setLoading(false);
                formik.resetForm();
                handleClose();
            }
        },
    });

    const handlePhoneChange = async (e) => {
        let phone = e.target.value;

        // Allow only numbers
        phone = phone.replace(/\D/g, '');

        // Restrict length to 10 digits max
        if (phone.length > 10) {
            phone = phone.slice(0, 10);
        }

        formik.setFieldValue('phone', phone);

        // Whenever phone changes, reset name and email first
        formik.setFieldValue('name', '');
        formik.setFieldValue('email', '');

        // Only fetch if phone length is exactly 10
        if (phone.length === 10) {
            try {
                // const player = await getPlayerByNumber(phone);
                const player = (await getPlayerByNumber(phone)) as { name?: string; email?: string } | null;
                if (player) {
                    formik.setFieldValue('name', player.name || '');
                    formik.setFieldValue('email', player.email || '');
                } else {
                    formik.setFieldValue('name', '');
                    formik.setFieldValue('email', '');
                    toast.warning("Player is not Register");
                }
            } catch (err) {
                console.error('Player lookup failed', err);
                formik.setFieldValue('name', '');
                formik.setFieldValue('email', '');
            }
        }
    };



    return (
        <Modal isOpen={open} onClose={handleClose} className="max-w-[600px] p-6 lg:p-10">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-bold flex-grow text-center">
                        Assign Player to the Tournament
                    </Typography>
                    <ClearIcon onClick={handleClose} className="cursor-pointer" />
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <Grid>
                        <Grid>
                            <Label>Phone</Label>
                            <Input
                                name="phone"
                                value={formik.values.phone}
                                onChange={handlePhoneChange}
                                onBlur={formik.handleBlur}
                                placeholder="Player Phone"
                                className="w-full"
                                maxLength={10}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <div className="text-red-500 text-xs">{formik.errors.phone}</div>
                            )}
                        </Grid>

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
                                <div className="text-red-500 text-xs">{formik.errors.name}</div>
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
                                <div className="text-red-500 text-xs">{formik.errors.email}</div>
                            )}
                        </Grid>


                    </Grid>

                    <div className="flex justify-center mt-6 gap-4">
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Save'}
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

export default AssignPlayerToTournament;
