'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Container,
    Card,
    Box,
    Typography,
    Divider,
    Stack,
    Button,
    Chip,
    Grid
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit, Delete } from '@mui/icons-material';
import { useParams } from 'next/navigation';
import { getProductById } from '@/services/productService';


interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    costPrice: number;
    rentalRate: number;
    rentedOut: number;
    stock: number;
    totalStock: number;
    status: string;
    description: string;
    productImage: string;
    createdAt: string;
    updatedAt: string;
}

export default function ProductDetailPage() {
    const theme = useTheme();
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const handleBack = () => window.history.back();

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await getProductById(id) as Product;
                setProduct(response);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (loading) {
        return <Typography variant="h6" sx={{ mt: 4 }}>Loading...</Typography>;
    }

    if (!product) {
        return <Typography variant="h6" sx={{ mt: 4 }}>No product found.</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Card
                sx={{
                    p: 4,
                    mb: 4,
                    boxShadow: theme.shadows[4],
                    borderRadius: 3,
                    backgroundColor: '#fff',
                }}
            >

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography variant="h5" fontWeight={700}>
                        {product.name.charAt(0).toUpperCase() + product.name.slice(1)} - Details
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid>
                        <Box
                            component="img"
                            src={
                                product.productImage
                                    ? `${process.env.NEXT_PUBLIC_API_IMG_URL}${product.productImage}`
                                    : '/placeholder.png'
                            }
                            alt={product.name}
                            sx={{
                                width: '50%',
                                borderRadius: 2,
                                objectFit: 'cover',
                                boxShadow: theme.shadows[2],
                            }}
                        />
                    </Grid>

                    <Grid>
                        <Stack spacing={1.5}>
                            <Typography><strong>Category:</strong> {product.category}</Typography>
                            <Typography><strong>Price:</strong> Rs{product.price}</Typography>
                            <Typography><strong>Cost Price:</strong> Rs{product.costPrice}</Typography>
                            <Typography><strong>Rental Rate:</strong> Rs{product.rentalRate}</Typography>
                            <Typography><strong>Rented Out:</strong> {product.rentedOut}</Typography>
                            <Typography><strong>Stock:</strong> {product.stock}/{product.totalStock}</Typography>

                            <Typography>
                                <strong>Status:</strong>{' '}
                                <Chip
                                    label={product.status.toUpperCase()}
                                    size="small"
                                    sx={{
                                        bgcolor:
                                            product.status === 'active'
                                                ? '#dcfce7'
                                                : '#fee2e2',
                                        color:
                                            product.status === 'active'
                                                ? '#16a34a'
                                                : '#dc2626',
                                        fontWeight: 600,
                                    }}
                                />
                            </Typography>

                            <Typography sx={{ mt: 2 }}>
                                <strong>Description:</strong> {product.description || 'No description'}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
            </Card>
        </Container>
    );
}
