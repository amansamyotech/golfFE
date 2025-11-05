'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container, Card, Typography, Grid, Divider, Table, TableBody,
  TableCell, TableRow, Box, Button
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getPaymentById } from "@/services/paymentService";
import moment from "moment";
import html2pdf from "html2pdf.js";

export default function PaymentSlipPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  const handleBack = () => window.history.back();
  const handleDownloadPDF = () => {
    const element = document.getElementById("receipt");

    html2pdf()
      .from(element)
      .save("payment-receipt.pdf");
  };

  useEffect(() => {
    const load = async () => {
      const res = await getPaymentById(id);
      setData(res);
    };
    load();
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    // <Container maxWidth="md" sx={{ py: 3 }}>
    //   <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
    //     Back
    //   </Button>
    //   <Card id="receipt" sx={{ p: 4 }}>

    //     <Box display="flex" justifyContent="space-between" mb={3}>
    //       <Typography variant="h5" fontWeight={700}>
    //         Payment Receipt
    //       </Typography>


    //     </Box>

    //     <Typography fontSize={14} color="gray" mb={2}>
    //       Today is {new Date().toLocaleDateString("en-GB")}
    //     </Typography>

    //     {/* Student / Customer and Booking Info */}
    //     <Grid container spacing={4}>
    //       <Grid>
    //         <Typography variant="subtitle1">Customer Details</Typography>
    //         <Divider sx={{ my: 1 }} />
    //         <Typography><b>Name:</b> {data.customerId?.name}</Typography>
    //         <Typography><b>Contact:</b> {data.customerId?.phone}</Typography>
    //         <Typography><b>Email:</b> {data.customerId?.email}</Typography>
    //       </Grid>

    //       <Grid>
    //         <Typography variant="subtitle1">Booking Details</Typography>
    //         <Divider sx={{ my: 1 }} />
    //         <Typography><b>Booking Date:</b>{moment(data.customerId?.startDate).format("DD/MM/YYYY")}</Typography>
    //         <Typography>
    //           {data.bookingId?.slotIds?.map((slot) => (
    //             <div key={slot._id}> <b>Slot Time:</b>
    //               {moment(slot.start).format("hh:mm A")} - {moment(slot.end).format("hh:mm A")}
    //             </div>
    //           ))}
    //         </Typography>
    //         <Typography><b>Course:</b> {data.bookingId?.course?.name}</Typography>
    //       </Grid>
    //     </Grid>

    //     <Divider sx={{ my: 3 }} />

    //     {/* Payment Details Table */}
    //     <Typography variant="h6" mb={1}>Payment Details</Typography>
    //     <Table>
    //       <TableBody>
    //         <TableRow>
    //           <TableCell><b>Total Amount</b></TableCell>
    //           <TableCell align="right">₹ {data.totalAmount}</TableCell>
    //         </TableRow>
    //         <TableRow>
    //           <TableCell><b>Discount</b></TableCell>
    //           <TableCell align="right"> {data.discount}%</TableCell>
    //         </TableRow>
    //         <TableRow>
    //           <TableCell><b>Paid Amount</b></TableCell>
    //           <TableCell align="right">₹ {data.paidAmount}</TableCell>
    //         </TableRow>
    //         <TableRow>
    //           <TableCell><b>Final Amount</b></TableCell>
    //           <TableCell align="right">₹ {data.paidAmount}</TableCell>
    //         </TableRow>
    //         <TableRow>
    //           <TableCell><b>Payment Mode</b></TableCell>
    //           <TableCell align="right">{data.paymentMode}</TableCell>
    //         </TableRow>
    //       </TableBody>
    //     </Table>
    //   </Card>

    //   <Box display="flex" justifyContent="center" mt={4}>
    //     <Button variant="contained"
    //       onClick={handleDownloadPDF}
    //     >
    //       Print Receipt
    //     </Button>
    //   </Box>
    // </Container>

    <Container maxWidth="md" sx={{ py: 3 }}>

      {/* Back Button top-right */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
      </Box>

      {/* Receipt Card */}
      <Card id="receipt" sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h5" fontWeight={700}>Payment Receipt</Typography>
        </Box>

        <Typography fontSize={14} color="gray" mb={2}>
          Today is {new Date().toLocaleDateString("en-GB")}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Customer Details</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography><b>Name:</b> {data.customerId?.name}</Typography>
            <Typography><b>Contact:</b> {data.customerId?.phone}</Typography>
            <Typography><b>Email:</b> {data.customerId?.email}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Booking Details</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography><b>Booking Date:</b> {moment(data.customerId?.startDate).format("DD/MM/YYYY")}</Typography>

            {data.bookingId?.slotIds?.map((slot) => (
              <Typography key={slot._id}>
                <b>Slot Time:</b> {moment(slot.start).format("hh:mm A")} - {moment(slot.end).format("hh:mm A")}
              </Typography>
            ))}

            <Typography><b>Course:</b> {data.bookingId?.course?.name}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" mb={1}>Payment Details</Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><b>Total Amount</b></TableCell>
              <TableCell align="right">₹ {data.totalAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Discount</b></TableCell>
              <TableCell align="right">{data.discount}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Paid Amount</b></TableCell>
              <TableCell align="right">₹ {data.paidAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Final Amount</b></TableCell>
              <TableCell align="right">₹ {data.paidAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Payment Mode</b></TableCell>
              <TableCell align="right">{data.paymentMode}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <Box display="flex" justifyContent="center" mt={4}>
        <Button variant="contained" onClick={handleDownloadPDF}>
          Print Receipt
        </Button>
      </Box>
    </Container>
  );
}

