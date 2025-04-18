import { statusConfig } from "../config";
import { timeAgo } from "../../utils/utils";
import TabPanel from "@mui/lab/TabPanel";
import { Card, Box, Typography } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { StatusChip } from "../chip";
import { EllipsisText } from "../text";

const HistoryPanel = ({ history }) => {
    return (
        <TabPanel value="History" sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
            {history.map((h, index) => (
                <Card
                    key={index}
                    sx={{
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
        </TabPanel>
    );
};

export default HistoryPanel