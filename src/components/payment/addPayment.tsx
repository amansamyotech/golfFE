import * as React from 'react';
import {
    Button,
    Grid,
    Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { Modal } from '@/components/ui/modal';
import { useState } from 'react';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import { ChevronDownIcon } from '@/icons';
import * as Yup from 'yup';
import { addPayment } from '@/services/paymentService';
import { log } from 'node:console';

const validationSchema = Yup.object().shape({
    paidAmount: Yup.number()
        .min(0, 'Amount cannot be negative')
        .required('Paid amount is required'),
    paymentMode: Yup.string().required('Payment mode is required'),
});

const AddPayment = ({ open, handleClose, data }) => {


    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            totalAmount: data?.totalAmount || '',
            discount: '',
            paidAmount: '',
            paymentMode: '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const payload = {
                customerId: data?.customerId?._id,
                bookingId: data?._id,
                totalAmount: values.totalAmount,
                discount: values.discount,
                paidAmount: values.paidAmount,
                paymentMode: values.paymentMode,
            };

            setLoading(true);
            try {
                await addPayment(payload);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
                formik.resetForm();
                handleClose();
            }
        }
    });

    const paymentModes = [
        { value: 'cash', label: 'Cash' },
        { value: 'upi', label: 'UPI' },
        { value: 'card', label: 'Card' },
        { value: 'bank', label: 'Bank Transfer' },
    ];

    return (
        <Modal isOpen={open} onClose={handleClose} className="max-w-[500px] p-6 lg:p-10">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-bold text-center flex-grow">
                        Payment
                    </Typography>
                    <ClearIcon onClick={handleClose} className="cursor-pointer" />
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <Grid>
                        <Grid>
                            <Label>Customer Name</Label>
                            <Input value={data?.name || ''} disabled className="w-full" />
                        </Grid>

                        <Grid>
                            <Label>Total Amount</Label>
                            <Input
                                id="totalAmount"
                                name="totalAmount"
                                type="number"
                                placeholder="Enter total amount"
                                className="w-full"
                                value={formik.values.totalAmount}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    const total = Number(e.target.value) || 0;
                                    const discount = Number(formik.values.discount) || 0;
                                    const discounted = total - (total * discount) / 100;
                                    formik.setFieldValue('paidAmount', discounted);
                                }}
                            />
                        </Grid>

                        <Grid>
                            <Label>Discount %</Label>
                            <Input
                                id="discount"
                                name="discount"
                                type="number"
                                placeholder="Enter discount %"
                                className="w-full"
                                value={formik.values.discount}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    const discount = Number(e.target.value) || 0;
                                    const total = Number(formik.values.totalAmount) || 0;
                                    const discounted = total - (total * discount) / 100;
                                    formik.setFieldValue('paidAmount', discounted);
                                }}
                            />
                        </Grid>

                        <Grid>
                            <Label>Paid Amount (After Discount)</Label>
                            <Input
                                id="paidAmount"
                                name="paidAmount"
                                type="number"
                                className="w-full"
                                value={formik.values.paidAmount}
                                disabled
                            />
                        </Grid>

                        <Grid>
                            <Label>Payment Mode</Label>
                            <div className="relative">
                                <Select
                                    id="paymentMode"
                                    options={paymentModes}
                                    placeholder="Select payment mode"
                                    value={formik.values.paymentMode}
                                    onChange={(opt) => formik.setFieldValue('paymentMode', opt)}
                                    className="dark:bg-dark-900"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                                {formik.touched.paymentMode && formik.errors.paymentMode && (
                                    <div className="text-red-400 text-xs">{formik.errors.paymentMode}</div>
                                )}
                            </div>
                        </Grid>
                    </Grid>

                    <div className="flex justify-center mt-6 gap-4">
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            Submit
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
export default AddPayment;

