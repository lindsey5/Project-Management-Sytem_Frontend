import Input from "../input"
import QrCodeScanner from "./QrCodeScanner"
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from "react";

const JoinProject = ({ close }) =>{
  const [value, setValue] = useState("manual");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmit = () => {

  }

    return <div className="fixed inset-0 bg-gray-600/50 flex justify-center items-center z-50">
            <div className="px-6 py-10 w-[90%] max-w-84 bg-white rounded-xl">
                <Box sx={{ width: '100%' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="secondary"
                        sx={{ marginTop: "20px"}}
                        indicatorColor="secondary"
                        centered
                    >
                        <Tab value="manual" label="Enter code" />
                        <Tab value="scan" label="Scan qr code" />
                    </Tabs>
                </Box>
                <div className="p-2">
                    {value == 'manual' && <Input label="Enter Code" className="w-full"/>}
                    {value == 'scan' && <QrCodeScanner />}
                </div>
                <div className="flex flex-row-reverse gap-3 mt-8">
                    {value == "manual" && <button 
                        className="bg-black text-white p-2 rounded-lg cursor-pointer hover:bg-gray-600"
                        onClick={handleSubmit}
                    >Join</button>}
                    <button className="p-2 rounded-lg cursor-pointer hover:bg-gray-200"
                        onClick={close}
                    >Cancel</button>
                </div>
            </div>
            
        </div>
}

export default JoinProject