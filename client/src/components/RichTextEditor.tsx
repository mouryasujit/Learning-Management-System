import { courses } from "@/assets/Types/interfaces";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
interface Props {
    input: courses;
    setInput: React.Dispatch<React.SetStateAction<courses>>;
  }
const RichTextEditor:React.FC<Props> = ({ input, setInput }) => {
  const onChangeHandler = (content: string) => {
    setInput({ ...input, description: content });
  };
  return (
    <ReactQuill
      theme="snow"
      value={input.description}
      onChange={onChangeHandler}
    />
  );
};

export default RichTextEditor;
