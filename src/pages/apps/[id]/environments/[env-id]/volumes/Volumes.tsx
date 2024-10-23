import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from "~/utils/api/Api";

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    // Create a FormData object to hold the files
    const formData = new FormData();

    // Append the files to the formData object
    acceptedFiles.forEach(file => {
      formData.append("files", file);
    });

    formData.append("appId", "1");
    formData.append("envId", "1");

    api
      .upload("/volumes", {
        body: formData,
      })
      .then(() => {
        console.log("ok");
      })
      .catch(e => {
        console.log(e);
      });
    // Do something with the files
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}

export default function Volumes() {
  return <MyDropzone />;
}
