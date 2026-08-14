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
import { toast } from "react-toastify";
import Select from "../form/Select";
import { ChevronDownIcon } from "@/icons";
import FileInput from "../form/input/FileInput";
import Image from "next/image";
import { addProduct, updateProduct } from "@/services/productService";

// ✅ Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    category: Yup.string().required("Category is required"),
    price: Yup.number().required("Price is required").min(0, "Price must be positive"),
    costPrice: Yup.number().min(0, "Cost price must be positive"),
    totalStock: Yup.number().required("Stock is required").min(0, "Stock must be positive"),
    rentalRate: Yup.number().min(0, "Rental rate must be positive"),
    description: Yup.string().max(300, "Description too long"),
    productImage: Yup.mixed().nullable(),
});

const AddProduct = ({ open, handleClose, data }) => {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const categoryOptions = [
        { value: "Balls", label: "Balls" },
        { value: "Clubs", label: "Clubs" },
        { value: "Apparel", label: "Apparel" },
        { value: "Cart", label: "Cart" },
    ];

    // 🧾 Formik setup
    const formik = useFormik({
        initialValues: {
            name: data?.name || "",
            category: data?.category || "",
            price: data?.price || "",
            costPrice: data?.costPrice || "",
            totalStock: data?.totalStock || "",
            rentalRate: data?.rentalRate || "",
            description: data?.description || "",
            productImage: data?.productImage || "",
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formData = new FormData();
                Object.entries(values).forEach(([key, val]) => {
                    if (val) formData.append(key, val);
                });

                if (data?._id) {
                    await updateProduct(data._id, formData);
                } else {
                    await addProduct(formData);
                }


            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                formik.resetForm();
                setImagePreview(null);
                handleClose();
            }
        },
    });

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            formik.setFieldValue("productImage", file);
        }
    };

    useEffect(() => {
        if (data?.productImage) {
            const imgPreviewUrl = `${process.env.NEXT_PUBLIC_API_IMG_URL}${data?.productImage}`
            setImagePreview(imgPreviewUrl);
        }
    }, [data]);

    return (
        <Modal isOpen={open} onClose={handleClose} className="max-w-[600px] p-6 lg:p-10">
            <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-bold flex-grow text-center">
                        {data ? "Edit Product Details" : "Add Product Details"}
                    </Typography>
                    <ClearIcon onClick={handleClose} className="cursor-pointer" />
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit}>
                    <Grid >
                        <Grid>
                            <Label>Product Name</Label>
                            <Input
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Product name"
                                className="w-full"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-red-500 text-xs">{formik.errors.name as string}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Category</Label>
                            <div className="relative">
                                <Select
                                    id="category"
                                    options={categoryOptions}
                                    placeholder="Select Category"
                                    value={formik.values.category}
                                    onChange={(option) => formik.setFieldValue("category", option)}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                            {formik.touched.category && formik.errors.category && (
                                <div className="text-red-500 text-xs">{formik.errors.category as string}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Price</Label>
                            <Input
                                type="number"
                                name="price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Product Price"
                            />
                            {formik.touched.price && formik.errors.price && (
                                <div className="text-red-500 text-xs">{formik.errors.price as string}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Cost Price</Label>
                            <Input
                                type="number"
                                name="costPrice"
                                value={formik.values.costPrice}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Cost Price"
                            />
                        </Grid>

                        <Grid>
                            <Label>Stock</Label>
                            <Input
                                type="number"
                                name="totalStock"
                                value={formik.values.totalStock}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Stock quantity"
                            />
                            {formik.touched.totalStock && formik.errors.totalStock && (
                                <div className="text-red-500 text-xs">{formik.errors.totalStock as string}</div>
                            )}
                        </Grid>

                        <Grid>
                            <Label>Rental Rate (Optional)</Label>
                            <Input
                                type="number"
                                name="rentalRate"
                                value={formik.values.rentalRate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Rate per day"
                            />
                        </Grid>

                        <Grid>
                            <Label>Description</Label>
                            <Input
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Product Description"
                            />
                        </Grid>

                        <Grid>
                            <Label>Product Image</Label>
                            <FileInput onChange={handleFileChange} />
                            {imagePreview && (
                                <div className="mt-2 w-32 h-32 relative">
                                    <Image
                                        src={imagePreview}
                                        alt="Product Preview"
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded"
                                    />
                                </div>
                            )}
                        </Grid>
                    </Grid>

                    {/* Buttons */}
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
            </div>
        </Modal>
    );
};

export default AddProduct;
