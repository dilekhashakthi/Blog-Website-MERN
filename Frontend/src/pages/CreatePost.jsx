import React, { useState } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  // ─── Simulated progress (same pattern as DashProfile) ───────────────────────
  let simulatorRef = null;

  const startSimulatedProgress = (setter) => {
    let current = 0;
    simulatorRef = setInterval(() => {
      const remaining = 85 - current;
      const increment = Math.random() * 2 + 1;
      current += Math.min(increment, remaining * 0.15);
      if (current >= 85) {
        current = 85;
        clearInterval(simulatorRef);
      }
      setter(Math.round(current));
    }, 100);
    return simulatorRef;
  };

  // ─── Upload image to our own MongoDB/GridFS backend ──────────────────────────
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    setImageUploadError(null);
    setImageUploadProgress(0);

    const interval = startSimulatedProgress(setImageUploadProgress);

    try {
      const data = new FormData();
      data.append("postImage", file);

      const res = await fetch(`/api/post/upload-image/${currentUser._id}`, {
        method: "PUT",
        credentials: "include",
        body: data,
      });

      clearInterval(interval);
      const json = await res.json();

      if (!res.ok) {
        setImageUploadError(json.message || "Image upload failed");
        setImageUploadProgress(null);
        return;
      }

      setImageUploadProgress(100);
      setFormData((prev) => ({ ...prev, image: json.imageUrl, imageFileId: json.fileId }));
      setTimeout(() => setImageUploadProgress(null), 1000);
    } catch {
      clearInterval(interval);
      setImageUploadError("Image upload failed. Check your connection.");
      setImageUploadProgress(null);
    }
  };

  // ─── Publish post ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null);

    const title = e.target.title?.value?.trim();
    const category = e.target.category?.value;
    const content = formData.content;

    if (!title || !content) {
      setPublishError("Title and content are required.");
      return;
    }

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, title, category }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message || "Failed to publish post.");
        return;
      }

      navigate(`/post/${data.slug}`);
    } catch {
      setPublishError("Something went wrong. Please try again.");
    }
  };

  const isUploading =
    imageUploadProgress !== null && imageUploadProgress < 100;

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            name="title"
            className="flex-1"
          />
          <Select id="category" name="category">
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">ReactJS</option>
            <option value="nextjs">NextJS</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <span className="w-7 h-7 inline-block">
                  <CircularProgressbar
                    value={imageUploadProgress || 0}
                    text={`${imageUploadProgress || 0}%`}
                    styles={buildStyles({
                      rotation: 0.25,
                      strokeLinecap: "round",
                      textSize: "28px",
                      pathTransitionDuration: 0.4,
                      pathColor: `rgba(130, 80, 255, ${(imageUploadProgress || 0) / 100 + 0.3})`,
                      textColor: "#ffffff",
                      trailColor: "rgba(255,255,255,0.15)",
                      backgroundColor: "#3e3e5e",
                    })}
                  />
                </span>
                Uploading...
              </span>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>

        {imageUploadError && (
          <Alert color="failure">{imageUploadError}</Alert>
        )}

        {formData.image && (
          <img
            src={formData.image}
            alt="Post preview"
            className="w-full h-72 object-cover"
          />
        )}

        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, content: value }))
          }
        />

        {publishError && (
          <Alert color="failure">{publishError}</Alert>
        )}

        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
