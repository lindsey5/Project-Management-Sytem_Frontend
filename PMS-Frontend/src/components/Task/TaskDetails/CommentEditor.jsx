import { Button, IconButton, Stack, Chip } from "@mui/material";
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
import { useContext, useRef, useState, memo } from "react";
import { openFile } from "../../../utils/utils";
import { createComment, createCommentAttachment } from "../../../services/CommentService";
import { CommentContext } from "../../../context/commentContext";

const FileChip = ({ file, index, deleteFile }) => {

  const open = () => openFile(file)
  const remove = () => deleteFile(index);

  return <Chip
      label={file.name}
      onClick={open}
      onDelete={remove}
      sx={{ maxWidth: '150px', cursor: 'pointer' }}
    />

}

const  CommentEditor = memo(({ task_id, close }) =>  {
  const rteRef = useRef(null);
  const [files, setFiles] = useState([]);
  const { fetchComments } = useContext(CommentContext)

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    setFiles(prev => [...prev, ...selectedFiles]);
  };
  
  const deleteFile = (index) => {
    setFiles(files.filter((file, i) => i !== index));
  }

  const getHtml = () => {
    if (rteRef.current && rteRef.current.editor) {
      return rteRef.current.editor.getHTML();
    }
    return '';
  }

  const save = async () => {
    const htmlContent = getHtml();
    const newComment = await createComment({ task_id, content: htmlContent});
    if (newComment.success) {
      await Promise.all(
        files.map(file => createCommentAttachment(newComment.comment.id, file))
      );

      await fetchComments(true)
      close();
    }
    close()
  }
  
  return (
    <div className="w-full flex flex-col gap-2 items-end">
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
      <Stack
          direction="row"  
          width="100%"
          overflow={'auto'}
          padding={1}
          boxSizing={'border-box'}
          gap={1}
        >
        {files.map((file, index) => (
            <FileChip key={index} file={file} index={index} deleteFile={deleteFile}/> 
        ))}
      </Stack>
      <Stack direction="row" gap={2}>
        <Button sx={{ marginTop: '10px' }} onClick={close}>
          Cancel
        </Button>
        <Button variant="contained" onClick={save} sx={{ marginTop: '10px' }}>
          Send
        </Button>
      </Stack>
    </div>
  );
})

export default CommentEditor