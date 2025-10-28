import { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Tabs,
    Tab,
    Typography,
    IconButton,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { EventAvailable, EventBusy } from "@mui/icons-material";
import { getAllIndividualSlots, getIndividualSlotsByCourseId } from "@/services/timeslotService";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween";
import ConfirmationBookingModal from "./ConfirmationBookingModal";
import { toast } from "react-toastify";

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

function TabPanel({
    value,
    index,
    children,
}: {
    value: number;
    index: number;
    children: React.ReactNode;
}) {
    return <div hidden={value !== index}>{value === index && <Box mt={2}>{children}</Box>}</div>;
}

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
                {isAvailable ? <EventAvailable fontSize="small" /> : <EventBusy fontSize="small" />}
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

export default function AssignSlotModalWithTabs({
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
    const [tab, setTab] = useState(0);
    const [slots, setSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openConfirmationModal, setOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [weekIndex, setWeekIndex] = useState(0);
    const [selectedWeeklySlots, setSelectedWeeklySlots] = useState<Record<string, any>>({});

    const planStart = dayjs(data?.customerId?.startDate);
    const planEnd = dayjs(data?.customerId?.expiryDate);

    const currentWeekStart = planStart.add(weekIndex * 7, "day").startOf("day");
    let currentWeekEnd = currentWeekStart.add(6, "day").endOf("day");

    if (currentWeekEnd.isAfter(planEnd)) {
        currentWeekEnd = planEnd.endOf("day");
    }

    const tabBookingTypeMap: Record<number, string> = {
        0: "daily",
        1: "weekly",
        2: "monthly",
        3: "yearly",
        4: "membership",
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        setSelectedWeeklySlots([]);
    };

    const handleSlotClick = (slot: any) => {
        const mergedData = {
            ...data,
            slot,
            bookingType: tabBookingTypeMap[tab],
        };
        setSelectedSlot(mergedData);
        setOpen(true);
    };

    const handleWeeklySlotClick = (slot: any) => {
        const dateKey = dayjs(slot.start).format("YYYY-MM-DD");

        setSelectedWeeklySlots((prev) => {
            if (prev[dateKey]?.start === slot.start && prev[dateKey]?.end === slot.end) {
                const updated = { ...prev };
                delete updated[dateKey];
                return updated;
            }
            return { ...prev, [dateKey]: slot };
        });
    };

    const handleConfirmWeeklyBooking = () => {
        const selected = Object.values(selectedWeeklySlots);

        const daysInWeek = currentWeekEnd.diff(currentWeekStart, "day") + 1;

        if (selected.length !== daysInWeek) {
            toast.warning(`Please select all ${daysInWeek} days before confirming.`);
            return;
        }
        setOpen(true);
        setSelectedSlot({
            ...data,
            slot: selected,
            bookingType: "weekly",
        });
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
                        Available Slots 
                    </Typography>

                    <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
                        <Tab label="Daily" />
                        <Tab label="Weekly" />
                        {/* <Tab label="Monthly" /> */}
                    </Tabs>

                    {loading ? (
                        <Box textAlign="center" mt={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {/* Daily */}
                            <TabPanel value={tab} index={0}>
                                {Object.keys(groupSlots((slot) => dayjs(slot.start).isSame(dayjs(), "day")))
                                    .length ? (
                                    <GroupedSlots
                                        groupedSlots={groupSlots((slot) => dayjs(slot.start).isSame(dayjs(), "day"))}
                                        onSlotClick={handleSlotClick}
                                    />
                                ) : (
                                    <Typography mt={2}>No slots found for today.</Typography>
                                )}
                            </TabPanel>

                            {/* Weekly */}
                            <TabPanel value={tab} index={1}>
                                {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <button
                                        onClick={() => setWeekIndex((prev) => Math.max(prev - 1, 0))}
                                        disabled={weekIndex === 0}
                                        style={{
                                            padding: "6px 12px",
                                            background: weekIndex === 0 ? "#ccc" : "#1976d2",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: weekIndex === 0 ? "not-allowed" : "pointer",
                                        }}
                                    >
                                        Previous Week
                                    </button> */}

                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                    Week: {currentWeekStart.format("DD MMM YYYY")} - {currentWeekEnd.format("DD MMM YYYY")}
                                </Typography>

                                {/* <button
                                        onClick={() => {
                                            const nextStart = planStart.add((weekIndex + 1) * 7, "day");
                                            if (nextStart.isBefore(planEnd)) {
                                                setWeekIndex((prev) => prev + 1);
                                            }
                                        }}
                                        disabled={!planStart.add((weekIndex + 1) * 7, "day").isBefore(planEnd)}
                                        style={{
                                            padding: "6px 12px",
                                            background: planStart.add((weekIndex + 1) * 7, "day").isBefore(planEnd)
                                                ? "#1976d2"
                                                : "#ccc",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: planStart.add((weekIndex + 1) * 7, "day").isBefore(planEnd)
                                                ? "pointer"
                                                : "not-allowed",
                                        }}
                                    >
                                        Next Week
                                    </button>
                                </Box> */}

                                {Object.keys(
                                    groupSlots((slot) =>
                                        dayjs(slot.start).isBetween(currentWeekStart, currentWeekEnd, null, "[]")
                                    )
                                ).length ? (
                                    <>
                                        <GroupedSlots
                                            groupedSlots={groupSlots((slot) =>
                                                dayjs(slot.start).isBetween(currentWeekStart, currentWeekEnd, null, "[]")
                                            )}
                                            onSlotClick={handleWeeklySlotClick}
                                            // selectedSlots={selectedWeeklySlots}
                                            selectedSlots={Object.values(selectedWeeklySlots)}
                                        />
                                        <Box textAlign="center" mt={2}>
                                            <button
                                                onClick={handleConfirmWeeklyBooking}
                                                style={{
                                                    padding: "8px 16px",
                                                    background: "#1976d2",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Confirm Weekly Booking
                                            </button>
                                        </Box>
                                    </>
                                ) : (
                                    <Typography mt={2}>No slots found for this week.</Typography>
                                )}
                            </TabPanel>

                            {/* Monthly */}
                             {/* <TabPanel value={tab} index={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <button
                                        onClick={() => setWeekIndex((prev) => Math.max(prev - 1, 0))}
                                        disabled={weekIndex === 0}
                                        style={{
                                            padding: "6px 12px",
                                            background: weekIndex === 0 ? "#ccc" : "#1976d2",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: weekIndex === 0 ? "not-allowed" : "pointer",
                                        }}
                                    >
                                        Previous Week
                                    </button>

                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                    Week: {currentWeekStart.format("DD MMM YYYY")} - {currentWeekEnd.format("DD MMM YYYY")}
                                </Typography>

                                <button
                                        onClick={() => {
                                            const nextStart = planStart.add((weekIndex + 1) * 7, "day");
                                            if (nextStart.isBefore(planEnd)) {
                                                setWeekIndex((prev) => prev + 1);
                                            }
                                        }}
                                        disabled={!planStart.add((weekIndex + 1) * 7, "day").isBefore(planEnd)}
                                        style={{
                                            padding: "6px 12px",
                                            background: planStart.add((weekIndex + 1) * 7, "day").isBefore(planEnd)
                                                ? "#1976d2"
                                                : "#ccc",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: planStart.add((weekIndex + 1) * 7, "day").isBefore(planEnd)
                                                ? "pointer"
                                                : "not-allowed",
                                        }}
                                    >
                                        Next Week
                                    </button>
                                </Box>

                                {Object.keys(
                                    groupSlots((slot) =>
                                        dayjs(slot.start).isBetween(currentWeekStart, currentWeekEnd, null, "[]")
                                    )
                                ).length ? (
                                    <>
                                        <GroupedSlots
                                            groupedSlots={groupSlots((slot) =>
                                                dayjs(slot.start).isBetween(currentWeekStart, currentWeekEnd, null, "[]")
                                            )}
                                            onSlotClick={handleWeeklySlotClick}
                                            // selectedSlots={selectedWeeklySlots}
                                            selectedSlots={Object.values(selectedWeeklySlots)}
                                        />
                                        <Box textAlign="center" mt={2}>
                                            <button
                                                onClick={handleConfirmWeeklyBooking}
                                                style={{
                                                    padding: "8px 16px",
                                                    background: "#1976d2",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Confirm Weekly Booking
                                            </button>
                                        </Box>
                                    </>
                                ) : (
                                    <Typography mt={2}>No slots found for this week.</Typography>
                                )}
                            </TabPanel> */}
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
}







































{/* <TabPanel value={tab} index={1}>
                                {Object.keys(
                                    groupSlots((slot) =>
                                        dayjs(slot.start).isBetween(dayjs().startOf("isoWeek"), dayjs().endOf("isoWeek"), null, "[]")
                                    )
                                ).length ? (
                                    <GroupedSlots
                                        groupedSlots={groupSlots((slot) =>
                                            dayjs(slot.start).isBetween(dayjs().startOf("isoWeek"), dayjs().endOf("isoWeek"), null, "[]")
                                        )}
                                        onSlotClick={handleSlotClick}
                                    />
                                ) : (
                                    <Typography mt={2}>No slots found for this week.</Typography>
                                )}
                            </TabPanel> */}





{/* <TabPanel value={tab} index={2}>
                                {Object.keys(groupSlots((slot) => dayjs(slot.start).isSame(dayjs(), "month"))).length ? (
                                    <GroupedSlots groupedSlots={groupSlots((slot) => dayjs(slot.start).isSame(dayjs(), "month"))} onSlotClick={handleSlotClick} />
                                ) : (
                                    <Typography mt={2}>No slots found for this month.</Typography>
                                )}
                            </TabPanel>

                            <TabPanel value={tab} index={3}>
                                {Object.keys(groupSlots((slot) => dayjs(slot.start).isSame(dayjs(), "year"))).length ? (
                                    <GroupedSlots groupedSlots={groupSlots((slot) => dayjs(slot.start).isSame(dayjs(), "year"))} onSlotClick={handleSlotClick} />
                                ) : (
                                    <Typography mt={2}>No slots found for this year.</Typography>
                                )}
                            </TabPanel>

                            {data?.customerId?.startDate && (
                                <TabPanel value={tab} index={4}>
                                    {Object.keys(
                                        groupSlots((slot) =>
                                            dayjs(slot.start).isBetween(
                                                dayjs(data?.customerId?.startDate).startOf("day"),
                                                dayjs(data?.customerId?.expiryDate).endOf("day"),
                                                null,
                                                "[]"
                                            )
                                        )
                                    ).length ? (
                                        <GroupedSlots
                                            groupedSlots={groupSlots((slot) =>
                                                dayjs(slot.start).isBetween(
                                                    dayjs(data?.customerId?.startDate).startOf("day"),
                                                    dayjs(data?.customerId?.expiryDate).endOf("day"),
                                                    null,
                                                    "[]"
                                                )
                                            )}
                                            onSlotClick={handleSlotClick}
                                        />
                                    ) : (
                                        <Typography mt={2}>No slots found in this membership period.</Typography>
                                    )}
                                </TabPanel>
                            )} */}

