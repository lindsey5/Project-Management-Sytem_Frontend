import { Button, IconButton, Stack, Chip} from "@mui/material";
import StarterKit from "@tiptap/starter-kit";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Placeholder from "@tiptap/extension-placeholder";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";
import { useRef, useState } from "react";
import { openFile } from "../../../utils/utils";

export default function CommentEditor({ close }) {
  const rteRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if(selectedFiles === 0) return
    setFiles(prev => [...prev, ...selectedFiles]);
  };
  
  const deleteFile = (index) => {
    setFiles(files.filter((file, i) => i !== index))
  }
  
  return <div className="w-full flex flex-col gap-2 items-end">
        <RichTextEditor
        className="w-full min-h-[250px]"
          ref={rteRef}
          extensions={[
            StarterKit,
            Placeholder.configure({
              placeholder: 'Write your comment here',
              emptyEditorClass: 'is-editor-empty',
              emptyNodeClass: 'is-node-empty',
              showOnlyWhenEditable: true,
              showOnlyCurrent: true,
            })
          ]}

          renderControls={() => (
            <MenuControlsContainer>
              <MenuSelectHeading />
              <MenuDivider />
              <MenuButtonBold />
              <MenuButtonItalic />
              <IconButton component="label" size="small">
                  <AttachFileIcon fontSize="inherit"/>
                    <input
                      type="file"
                      multiple
                      onChange={handleFiles}
                      style={{ display: 'none' }}
                      accept="image/*,application/pdf,doc,.docx"
                    />
              </IconButton>
            </MenuControlsContainer>
          )}
        />
       {files && files.length > 0 && <Stack
          direction="row"  
          width="100%"
          overflow={'auto'}
          padding={1}
          boxSizing={'border-box'}
          gap={1}
       >
          {files.map((file, index) => {
            return <Chip
                      label={file.name}
                      onClick={() => openFile(file)}
                      onDelete={() => deleteFile(index)}
                       sx={{ maxWidth: '150px', cursor: 'pointer'}}
                    />
          })}
        </Stack>}
        <Stack direction="row" gap={2}>
        <Button sx={{ marginTop: '10px'}} onClick={close}>
            Cancel
          </Button>
        <Button variant="contained"  sx={{ marginTop: '10px'}}>
            Send
          </Button>
        </Stack>
        
  </div>  
}