'use client';
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
  Avatar,
  Grid
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getStaffById } from '@/services/staffService';
import { useParams } from 'next/navigation';

// Static staff data (dummy)
const staff = {
  _id: "69044f69e9ba0c7efb79a835",
  name: "Rahul Sharma",
  email: "rahul@gmail.com",
  phone: "9090889900",
  gender: "female",
  profileImg: "/images/qrcode_unityfund-omega.vercel.app-1761890153532.png",
  address: "Indore",
  jobTitle: "Senior Manager",
  department: "management",
  employmentType: "full-time",
  dateOfJoining: "2025-10-31",
  workShift: "morning",
  salary: 25000,
  availabilityStatus: "available",
  createdAt: "2025-10-31",
  updatedAt: "2025-10-31"
};

interface Staff {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other";
  profileImg: string;
  address: string;
  jobTitle: string;
  department: string;
  employmentType: "full-time" | "part-time" | "contract";
  dateOfJoining: string;
  workShift: "morning" | "evening" | "night";
  salary: number;
  availabilityStatus: "available" | "unavailable" | "on-leave";
  createdAt: string;
  updatedAt: string;
}


export default function StaffDetailPage() {
  const theme = useTheme();
  const { id } = useParams();
  const [staff, setStaff] = useState<Staff | null>(null);;

  const handleBack = () => {
    window.history.back();
  };


  useEffect(() => {
    async function fetchStaffDetails() {
      try {
        const response = await getStaffById(id) as Staff;
        setStaff(response);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
    fetchStaffDetails();
  }, [id]);

  const imageUrl = staff?.profileImg
    ? `${process.env.NEXT_PUBLIC_API_IMG_URL}${staff?.profileImg}`
    : "/default-avatar.png";



  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card
        sx={{
          p: 4,
          mb: 4,
          boxShadow: theme.shadows[4],
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>
            {staff?.name} - Staff Details
          </Typography>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Profile & Basic Info */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar src={imageUrl} alt={staff?.name} sx={{ width: 80, height: 80 }} />
          <Stack>
            <Typography variant="h6" fontWeight={600}>{staff?.name}</Typography>
            <Typography>{staff?.jobTitle} ({staff?.department})</Typography>
            <Chip
              label={staff?.availabilityStatus.toUpperCase()}
              size="small"
              sx={{
                mt: 1,
                bgcolor: staff?.availabilityStatus === "available" ? "#dcfce7" : "#fee2e2",
                color: staff?.availabilityStatus === "available" ? "#16a34a" : "#dc2626",
                fontWeight: 600,
                borderRadius: 1,
              }}
            />
          </Stack>
        </Stack>
        

        <Divider sx={{ my: 2 }} />

        {/* Details */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid>
            <Typography><strong>Email:</strong> {staff?.email}</Typography>
            <Typography><strong>Phone:</strong> {staff?.phone}</Typography>
            <Typography><strong>Gender:</strong> {staff?.gender}</Typography>
            <Typography><strong>Address:</strong> {staff?.address}</Typography>
            <Typography><strong>Salary:</strong> ₹{staff?.salary}</Typography>
          </Grid>

          <Grid>
            <Typography><strong>Department:</strong> {staff?.department}</Typography>
            <Typography><strong>Employment Type:</strong> {staff?.employmentType}</Typography>
            <Typography><strong>Work Shift:</strong> {staff?.workShift}</Typography>
            <Typography><strong>Date of Joining:</strong> {new Date(staff?.dateOfJoining).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
