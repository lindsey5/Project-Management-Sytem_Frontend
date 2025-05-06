import { statusConfig } from "../../../../../components/config";
import { timeAgo } from "../../../../../utils/utils";
import TabPanel from "@mui/lab/TabPanel";
import { Card, Box, Typography, CircularProgress } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { StatusChip } from "../../../../../components/chip";
import { EllipsisText } from "../../../../../components/text";
import { useEffect, useState, useRef, useCallback } from "react";
import { getTaskHistory } from "../../../../../services/TaskService";

const HistoryPanel = ({ task_id }) => {
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const lastItemRef = useCallback((node) => {
        if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
        
    },[hasMore]);
    
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true)
            const fetchedHistory = await getTaskHistory(task_id, page);
            setLoading(false)
            if (fetchedHistory.history.length === 0) {
                setHasMore(false);
                return;
            }
            setHistory([...history, ...fetchedHistory.history])
        }
        fetchHistory()
    }, [page])

    return (
        <TabPanel value="History" sx={{ display: 'flex', flexDirection: "column", gap: 2, alignItems: 'center' }}>
            {history.map((h, index) => (
                <Card
                    ref={index === history.length -1 ? lastItemRef : null}
                    key={index}
                    sx={{
                        width: '100%',
                        border: 1,
                        borderColor: '#e7e7e7',
                        padding: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        flexWrap: 'wrap'
                    }}
                >
                    <Box display="flex" flexDirection="column" gap={1} flex={1}>
                        <Typography>{h.action_Description}</Typography>

                        {!(h.new_Value == null && h.prev_Value == null) && (
                            <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                                {h.prev_Value && (
                                    <StatusChip
                                        color={statusConfig[h.prev_Value]}
                                        label={
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ textWrap: "nowrap" }}
                                                textOverflow="ellipsis"
                                                maxWidth="200px"
                                                overflow="hidden"
                                            >
                                                <EllipsisText text={h.prev_Value || ""} />
                                            </Typography>
                                        }
                                    />
                                )}

                                <ArrowRightAltIcon />

                                {h.new_Value && (
                                    <StatusChip
                                        color={statusConfig[h.new_Value]}
                                        label={
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ textWrap: "nowrap" }}
                                                textOverflow="ellipsis"
                                                maxWidth="200px"
                                                overflow="hidden"
                                            >
                                                <EllipsisText text={h.new_Value || ""} />
                                            </Typography>
                                        }
                                    />
                                )}
                            </Box>
                        )}
                    </Box>

                    <Typography variant="subtitle2" whiteSpace="nowrap">
                        {timeAgo(new Date(h.date_Time), new Date())}
                    </Typography>
                </Card>
            ))}
            {loading && <CircularProgress />}
        </TabPanel>
    );
};

export default HistoryPanel