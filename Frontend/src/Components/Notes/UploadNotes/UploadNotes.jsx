import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import FormField from "../../Login/LoginFormField";
import { GrCloudUpload } from "react-icons/gr";

const UploadNotes = ({ notify }) => {
  const [file, setFile] = useState(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const onSubmit = async (data) => {
    if (!file) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("subject", data.subject);
    formData.append("title", data.title);
    formData.append("file", file);
    formData.append("uploadedBy", data.username);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/notes-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${document.cookie.split("=")[1]}`,
          },
          withCredentials: true,
        }
      );

      reset();
      setFile(null);
      notify(response.data.message, "success");
    } catch (err) {
      setUploadError(err.response.data.message);
      notify(err.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="main pt-16 xl:p-0 text-white min-h-screen w-full xl:h-screen xl:w-full flex justify-center items-center flex-col">
      <div className="content-wrap h-fit w-full sm:w-[25rem] flex gap-4 justify-center items-center flex-col">
        <div className="mainForm h-fit w-full p-4 overflow-hidden rounded-md">
          <div className="top w-full h-fit flex justify-between items-center flex-col">
            <h1 className="text-4xl font-[600] font-[Satoshi]">Upload Notes</h1>
          </div>
          <div className="main-content h-full w-full mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full">
              <FormField
                label="Subject"
                name="subject"
                control={control}
                errors={errors.subject?.message}
                upload={true}
                placeholder="Enter subject in short form!"
              />
              <FormField
                label="Title"
                name="title"
                control={control}
                errors={errors.title?.message}
                upload={true}
                placeholder="Enter subject name in long form!"
              />

              <div className="mt-4 flex flex-col items-center">
                <label
                  htmlFor="file"
                  className="text-base w-full font-base text-white"
                >
                  Upload File
                </label>
                <div className="inpuWrap relative cursor-pointer text-center w-full px-2 py-2 font-[Mona] mt-2 text-base bg-transparent rounded-lg font-medium border-[1px] border-zinc-700 outline-none active:bg-zinc-950">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    // "opacity-0 cursor-pointer text-center file:opacity-0 w-full px-2 py-2 font-[Mona] mt-2 text-base bg-transparent rounded-lg font-medium border-[1px] border-zinc-700 outline-none active:bg-zinc-950"
                    className="cursor-pointer text-center file:opacity-0 w-full bg-transparent rounded-lg h-full flex justify-center items-center"
                    id="file"
                  />
                  <GrCloudUpload className="pointer-events-none text-white text-2xl mt-2 absolute top-1 left-5" />
                </div>
              </div>
              <FormField
                label="Username"
                name="username"
                control={control}
                errors={errors.username?.message}
                upload={true}
                placeholder="Enter your name!"
              />
              <button
                type="submit"
                disabled={isLoading}
                className=" w-full mt-4 px-4 py-2 bg-white text-black rounded-full text-base font-medium"
              >
                {isLoading ? "Uploading..." : "Upload Note"}
              </button>
              {uploadError && (
                <p className="text-red-500 mt-2">{uploadError}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNotes;
