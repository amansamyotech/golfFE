// import { Dialog, DialogTitle, DialogContent, Typography, Button, Stack } from '@mui/material';
// import React from 'react';

// interface MemberDetailDialogProps {
//     open: boolean;
//     handleClose: () => void;
//     // member: Member | null;
// }

// const MemberDetailDialog: React.FC<MemberDetailDialogProps> = ({ open, handleClose, member }) => {
//     return (
//         <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//             <DialogTitle>Member Details</DialogTitle>
//             <DialogContent dividers>
//                 {member ? (
//                     <Stack spacing={2}>
//                         <Typography><strong>Name:</strong> {member.name}</Typography>
//                         <Typography><strong>Email:</strong> {member.email}</Typography>
//                         <Typography><strong>Plan:</strong> {member.plan?.title || 'N/A'}</Typography>
//                         <Typography><strong>Course:</strong> {member.course?.name || 'N/A'}</Typography>
//                         <Typography><strong>Status:</strong> {member.status}</Typography>
//                     </Stack>
//                 ) : (
//                     <Typography>No data available.</Typography>
//                 )}
//             </DialogContent>
//             <Button onClick={handleClose} sx={{ m: 2 }} variant="contained">
//                 Close
//             </Button>
//         </Dialog>
//     );
// };

// export default MemberDetailDialog;

// components/MemberDetailDialog.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Stack, Divider } from '@mui/material';
import React from 'react';

interface MemberDetailDialogProps {
    open: boolean;
    handleClose: () => void;
    member?: {
        name: string;
        email: string;
        plan?: { title: string };
        course?: { name: string };
        status: string;
    } | null;
}

const MemberDetailDialog: React.FC<MemberDetailDialogProps> = ({ open, handleClose, member }) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Member Details</DialogTitle>
            <DialogContent dividers>
                {member ? (
                    <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" fontWeight="bold">Name:</Typography>
                            <Typography variant="body1">{member.name}</Typography>
                        </Stack>
                        <Divider />

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" fontWeight="bold">Email:</Typography>
                            <Typography variant="body1">{member.email}</Typography>
                        </Stack>
                        <Divider />

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" fontWeight="bold">Plan:</Typography>
                            <Typography variant="body1">{member.plan?.title || 'N/A'}</Typography>
                        </Stack>
                        <Divider />

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" fontWeight="bold">Course:</Typography>
                            <Typography variant="body1">{member.course?.name || 'N/A'}</Typography>
                        </Stack>
                        <Divider />

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" fontWeight="bold">Status:</Typography>
                            <Typography variant="body1">{member.status}</Typography>
                        </Stack>
                    </Stack>
                ) : (
                    <Typography color="textSecondary" align="center">No data available.</Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ padding: 2 }}>
                <Button onClick={handleClose} variant="contained" color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MemberDetailDialog;





