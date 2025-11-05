



'use client';

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import {
    Box,
    Button,
    Card,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getTournamentById } from "@/services/tournamentService";

export default function TournamentDetailPage() {
    const theme = useTheme();
    const { id } = useParams();

    const [tournament, setTournament] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });

    const handleBack = () => window.history.back();

    const fetchTournamentData = async () => {
        try {
            setLoading(true);
            const response = await getTournamentById(id);
            setTournament(response);
        } catch (error) {
            console.error("Error fetching tournament:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchTournamentData();
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6">Loading tournament details...</Typography>
            </Container>
        );
    }

    if (!tournament) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6">No tournament data found.</Typography>
            </Container>
        );
    }

    const columns: GridColDef[] = [
        { field: 'index', headerName: '#', width: 70 },
        { field: 'name', headerName: 'Player Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Phone', flex: 1 },
        { field: 'age', headerName: 'Age', flex: 0.5 },
        { field: 'status', headerName: 'Status', flex: 0.8 },
    ];

    const rows = tournament?.participants?.map((p: any, index: number) => ({
        id: p._id || index,
        index: index + 1,
        name: p.name || "-",
        email: p.email || "-",
        phone: p.phone || "-",
        age: p.age || "-",
        handicap: p.handicap || "-",
        status: p.status || "Active",
    })) || [];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Card sx={{ p: 3, mb: 4, boxShadow: theme.shadows[4], borderRadius: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5" fontWeight={700}>
                        {tournament.name} - Tournament Details
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

                <Grid>
                    <Grid>
                        <Stack spacing={1}>
                            <Typography><strong>Description:</strong> {tournament.description}</Typography>
                            <Typography><strong>Location:</strong> {tournament.location}</Typography>
                            <Typography><strong>Course:</strong> {tournament.course?.name}</Typography>
                            <Typography><strong>Format:</strong> {tournament.format}</Typography>
                        </Stack>
                    </Grid>
                    <Grid>
                        <Stack spacing={1}>
                            <Typography><strong>Start Date:</strong> {new Date(tournament.startDate).toLocaleDateString()}</Typography>
                            <Typography><strong>End Date:</strong> {new Date(tournament.endDate).toLocaleDateString()}</Typography>
                            <Typography><strong>Status:</strong> {tournament.status}</Typography>
                            <Typography>
                                <strong>Participants:</strong> {tournament.participantsPlay} / {tournament.participantsRequired}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>

            <Box>
                {rows.length === 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "150px",
                        }}
                    >
                        <Typography color="text.secondary" align="center">
                            No participants added yet.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h6" mb={2}>Players</Typography>
                        <DataGrid
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[5]}
                            disableRowSelectionOnClick
                            columns={columns}
                            rows={rows}
                        />
                    </>
                )}
            </Box>
        </Container>
    );
}
