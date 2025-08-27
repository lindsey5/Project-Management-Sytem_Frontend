import { useState, useRef, useEffect, useCallback, useContext} from "react";
import { statusConfig } from "../../../components/config";
import { timeAgo } from "../../../utils/utils";
import { Card, Box, Typography } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { StatusChip } from "../../../components/chip";
import { getProjectTaskHistory } from "../../../services/TaskService";
import { ProjectContext } from "../../../layouts/ProjectLayout";
import { useNavigate } from "react-router-dom";

const ProjectActivity = () => {
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const { project } = useContext(ProjectContext);
    const navigate = useNavigate();

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
            const fetchedHistory = await getProjectTaskHistory(project.id, page);
            
            if (fetchedHistory.history.length === 0) {
                setHasMore(false);
                return;
            }
            setHistory([...history, ...fetchedHistory.history])
        }
        fetchHistory()
    }, [page])

    return (
        <div className="min-h-0 flex-grow overflow-y-auto">
            {history.map((h, index) => {
                return (
                <Card
                    onClick={() => navigate(`/project/tasks?c=${project.project_code}`, { state: { task : h.task_Id } })}
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
                        flexWrap: 'wrap',
                        cursor: 'pointer',
                        ":hover": {
                            backgroundColor: '#f9fafb'
                        }
                    }}
                >
                    <Box display="flex" flexDirection="column" gap={1} flex={1}>
                        <Typography fontWeight={"bold"}>{h?.task?.task_Name}</Typography>
                        <Typography>{h.action_Description}</Typography>

                        {!(h.new_Value == null && h.prev_Value == null) && (
                            <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                                {h.prev_Value && (
                                    <StatusChip
                                        color={statusConfig[h.prev_Value]}
                                        label={
                                            <Typography
                                                variant="subtitle1"
                                            >
                                                {h.prev_Value}
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
                                            >
                                                {h.new_Value}
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
            )
            })}
        </div>
    );
};

export default ProjectActivity