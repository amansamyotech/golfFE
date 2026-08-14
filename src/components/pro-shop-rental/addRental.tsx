"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Typography,
  Grid,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Modal } from "@/components/ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { ChevronDownIcon } from "@/icons";
import { toast } from "react-toastify";
import { getAllProducts } from "@/services/productService";
import { getAllCustomer } from "@/services/customerService";
import DatePicker from "../form/date-picker";
import { createRental, updateRental } from "@/services/rentalProductService";

const validationSchema = Yup.object().shape({
  productId: Yup.string().required("Product is required"),
  // customerId: Yup.string().required("Customer is required"),
  quantity: Yup.number()
    .required("Quantity is required")
    .min(1, "Must rent at least one item"),
  rentedDate: Yup.date().required("Rented date is required"),
  returnDate: Yup.date()
    .nullable()
    .min(Yup.ref("rentedDate"), "Return date cannot be before rented date"),
  totalAmount: Yup.number().min(0, "Amount cannot be negative"),
  notes: Yup.string().max(300, "Notes too long"),
});

interface Product {
  _id: string;
  name: string;
  rentalRate: Number;
}

interface Customer {
  _id: string;
  name: string;
}

const AddRental = ({ open, handleClose, data }) => {

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const formik = useFormik({
    initialValues: {
      productId: data?.productId?._id || "",
      customerId: data?.customerId || "",
      quantity: data?.quantity || 1,
      rentedDate: data?.rentedDate ? new Date(data.rentedDate).toISOString().split("T")[0] : "",
      returnDate: data?.returnDate ? new Date(data.returnDate).toISOString().split("T")[0] : "",
      totalAmount: data?.totalAmount || 0,
      notes: data?.notes || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (data) {
          await updateRental(data?._id, values);
        } else {
          await createRental(values);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to save rental");
      } finally {
        setLoading(false);
        formik.resetForm();
        handleClose();
      }
    },
  });

  const statusOptions = [
    { value: "rented", label: "Rented" },
    { value: "returned", label: "Returned" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const fetchProducts = async () => {
    const products = await getAllProducts() as Product[];
    const formattedProducts = products?.map((product: Product) => ({
      value: product?._id,
      label: product?.name,
      rentalRate: product?.rentalRate,
    }));
    setProducts(formattedProducts);
  };

  const fetchCustomers = async () => {
    const customers = await getAllCustomer() as Customer[];
    const formattedCustomers = customers?.map((customer: Customer) => ({
      value: customer?._id,
      label: customer?.name,
    }));
    setCustomers(formattedCustomers);
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, [open]);

  useEffect(() => {
    if (selectedProduct && formik.values.quantity && formik.values.rentedDate && formik.values.returnDate) {
      const start = new Date(formik.values.rentedDate);
      const end = new Date(formik.values.returnDate);

      // const diffInDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      // const diffInDays = Math.max(
      //   1,Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
      // );

      const diffInDays = Math.max(
        1,
        Math.ceil(
          (new Date(end as any).getTime() - new Date(start as any).getTime()) /
          (1000 * 60 * 60 * 24)
        ) + 1
      );

      const total = selectedProduct.rentalRate * formik.values.quantity * diffInDays;
      formik.setFieldValue("totalAmount", total);
    } else if (selectedProduct && formik.values.quantity) {
      const total = selectedProduct.rentalRate * formik.values.quantity;
      formik.setFieldValue("totalAmount", total);
    }
  }, [
    selectedProduct,
    formik.values.quantity,
    formik.values.rentedDate,
    formik.values.returnDate,
  ]);


  return (
    <Modal isOpen={open} onClose={handleClose} className="max-w-[600px] p-6 lg:p-10">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6" className="font-bold flex-grow text-center">
          {data ? "Edit Rental Details" : "Add Rental Details"}
        </Typography>
        <ClearIcon onClick={handleClose} className="cursor-pointer" />
      </div>


      <form onSubmit={formik.handleSubmit}>
        <Grid>
          <Grid>
            <Label>Product</Label>
            <div className="relative">
              <Select
                id="productId"
                options={products}
                placeholder="Select Product"
                value={formik.values.productId}
                // onChange={(option) => formik.setFieldValue("productId", option)}
                onChange={(option) => {
                  formik.setFieldValue("productId", option);
                  const prod = products.find((p) => p.value === option);
                  setSelectedProduct(prod);
                }}
              />
              <span className="absolute text-gray-500 right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDownIcon />
              </span>
            </div>
            {formik.touched.productId && formik.errors.productId && (
              <div className="text-red-500 text-xs">{formik.errors.productId as string}</div>
            )}
          </Grid>

          {
            data ?
              <>
              </> :
              <Grid>
                <Label>Customer</Label>
                <div className="relative">
                  <Select
                    id="customerId"
                    options={customers}
                    placeholder="Select Customer"
                    value={formik.values.customerId}
                    onChange={(option) => formik.setFieldValue("customerId", option)}
                  />
                  <span className="absolute text-gray-500 right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDownIcon />
                  </span>
                </div>
                {formik.touched.customerId && formik.errors.customerId && (
                  <div className="text-red-500 text-xs">{formik.errors.customerId as string}</div>
                )}
              </Grid>
          }

          <Grid>
            <Label>Quantity</Label>
            <Input
              type="number"
              name="quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter quantity"
            />
            {formik.touched.quantity && formik.errors.quantity && (
              <div className="text-red-500 text-xs">{formik.errors.quantity as string}</div>
            )}
          </Grid>

          <Grid>
            <DatePicker
              id="rentedDate"
              label="Rented Date"
              placeholder="Select a rented date"
              minDate='today'
              defaultDate={formik.values.rentedDate}
              onChange={(date) => {
                formik.setFieldValue('rentedDate', date)
              }}
            />
            {formik.touched.rentedDate && formik.errors.rentedDate && (
              <div className="text-red-400 text-xs ">{formik.errors.rentedDate}</div>
            )}
          </Grid>

          <Grid>
            <DatePicker
              id="returnDate"
              label="Return Date"
              placeholder="Select a return date"
              minDate='today'
              defaultDate={formik.values.returnDate}
              onChange={(date) => {
                formik.setFieldValue('returnDate', date)
              }}
            />
            {formik.touched.returnDate && formik.errors.returnDate && (
              <div className="text-red-400 text-xs ">{formik.errors.returnDate}</div>
            )}
          </Grid>

          <Grid>
            <Label>Total Amount</Label>
            <Input
              type="number"
              name="totalAmount"
              value={formik.values.totalAmount}
              readOnly
              placeholder="Auto calculated"
              className="bg-gray-100 cursor-not-allowed"
            />
            {formik.touched.totalAmount && formik.errors.totalAmount && (
              <div className="text-red-500 text-xs">{formik.errors.totalAmount as string}</div>
            )}
          </Grid>

          <Grid>
            <Label>Notes</Label>
            <Input
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Add notes"
            />
          </Grid>
        </Grid>

        <div className="flex justify-center mt-6 gap-4">
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
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

export default AddRental;
