import { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    IconButton,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { EventAvailable, EventBusy } from "@mui/icons-material";
import { getAllIndividualSlots, getIndividualSlotsByCourseId } from "@/services/timeslotService";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import ConfirmationBookingModal from "../tee-time-management/ConfirmationBookingModal";

function SlotBox({
    slot,
    onClick,
    selected,
}: {
    slot: any;
    onClick: (slot: any) => void;
    selected?: boolean;
}) {
    const isAvailable = slot.status === "available";
    return (
        <Box
            onClick={() => isAvailable && onClick(slot)}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: selected
                    ? "#90caf9"
                    : isAvailable
                        ? "#c8e6c9"
                        : "#ffcccc",
                color: isAvailable ? "#2e7d32" : "#d32f2f",
                borderRadius: 2,
                padding: "6px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease",
                cursor: isAvailable ? "pointer" : "not-allowed",
                textAlign: "center",
                "&:hover": {
                    backgroundColor: selected
                        ? "#64b5f6"
                        : isAvailable
                            ? "#a5d6a7"
                            : "#ef9a9a",
                    transform: "scale(1.02)",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    mb: 0.5,
                }}
            >
                {isAvailable ? (
                    <EventAvailable fontSize="small" />
                ) : (
                    <EventBusy fontSize="small" />
                )}
                <Typography variant="body2" sx={{ fontWeight: "medium", fontSize: "0.85rem" }}>
                    {dayjs(slot.start).format("h:mm A")} - {dayjs(slot.end).format("h:mm A")}
                </Typography>
            </Box>
            <Typography
                variant="caption"
                sx={{
                    fontWeight: "bold",
                    color: slot.is_weekend ? "#d81b60" : "#1976d2",
                    fontSize: "0.75rem",
                }}
            >
                {slot.is_weekend ? "Weekend" : "Weekday"}
            </Typography>
        </Box>
    );
}

function GroupedSlots({
    groupedSlots,
    onSlotClick,
    selectedSlots,
}: {
    groupedSlots: Record<string, any[]>;
    onSlotClick: (slot: any) => void;
    selectedSlots?: any[];
}) {
    return (
        <Box>
            {Object.keys(groupedSlots).map((date, idx) => (
                <Box key={idx} sx={{ mb: 3, px: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: "#616161",
                            fontWeight: "medium",
                            mb: 1.5,
                            borderBottom: "2px solid #1976d2",
                            pb: 1,
                        }}
                    >
                        {date}
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 1.5,
                        }}
                    >
                        {groupedSlots[date].map((slot, sidx) => (
                            <SlotBox
                                key={sidx}
                                slot={slot}
                                onClick={onSlotClick}
                                selected={selectedSlots?.includes(slot)}
                            />
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

export default function AssignSlotToGuest({
    open,
    onClose,
    data,
    onSlotsLoaded,
}: {
    open: boolean;
    onClose: () => void;
    data: any;
    onSlotsLoaded?: (hasSlots: boolean) => void;
}) {
    const [slots, setSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [openConfirmationModal, setOpen] = useState(false);

    const handleSlotClick = (slot: any) => {
        const mergedData = {
            ...data,
            slot,
            bookingType: "daily",
        };
        setSelectedSlot(mergedData);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        fetchSlots();
    };

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const res = await getAllIndividualSlots();
            const hasSlots = Array.isArray(res) && res.length > 0;
            onSlotsLoaded?.(hasSlots);

            const response = await getIndividualSlotsByCourseId(data?.course?._id) as any[];
            setSlots(response || []);


        } catch (err) {
            console.error("Error fetching slots:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, [data]);

    const groupSlots = (filterFn: (slot: any) => boolean) => {
        const filteredSlots = slots.filter(filterFn);
        const grouped: Record<string, any[]> = {};
        filteredSlots.forEach((slot) => {
            const dateKey = dayjs(slot.start).format("dddd, DD MMM YYYY");
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(slot);
        });
        return grouped;
    };

    const selectedDate = dayjs(data?.startDate || data?.customerId?.startDate);

    return (
        <>
            <ConfirmationBookingModal
                open={openConfirmationModal}
                onClose={handleCloseModal}
                slot={selectedSlot}
            />
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: "absolute" as const,
                        top: "10%",
                        left: "50%",
                        transform: "translate(-50%, 0)",
                        width: "90%",
                        maxWidth: 900,
                        maxHeight: "80vh",
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        overflowY: "auto",
                    }}
                >
                    <IconButton
                        onClick={onClose}
                        sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
                        Available Slots for {selectedDate.format("DD MMM YYYY")}
                    </Typography>

                    {loading ? (
                        <Box textAlign="center" mt={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {Object.keys(
                                groupSlots((slot) => dayjs(slot.start).isSame(selectedDate, "day"))
                            ).length ? (
                                <GroupedSlots
                                    groupedSlots={groupSlots((slot) =>
                                        dayjs(slot.start).isSame(selectedDate, "day")
                                    )}
                                    onSlotClick={handleSlotClick}
                                />
                            ) : (
                                <Typography mt={2} textAlign="center">
                                    No slots found for {selectedDate.format("DD MMM YYYY")}.
                                </Typography>
                            )}
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
}
