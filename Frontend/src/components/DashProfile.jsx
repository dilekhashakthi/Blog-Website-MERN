import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const safeParseJSON = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const filePickerRef = useRef();
  const xhrRef = useRef(null);
  const simulatorRef = useRef(null); // interval ref for simulated progress

  // ─── Simulated progress ──────────────────────────────────────────────────────
  // memoryStorage uploads complete instantly before XHR progress fires,
  // so we animate the bar from 0 → 85 while waiting for the server response,
  // then jump to 100 on success.
  const startSimulatedProgress = () => {
    let current = 0;
    simulatorRef.current = setInterval(() => {
      const remaining = 85 - current;
      const increment = Math.random() * 2 + 1; // 1–3% per tick
      current += Math.min(increment, remaining * 0.15); // decelerate near 85
      if (current >= 85) {
        current = 85;
        clearInterval(simulatorRef.current);
      }
      setUploadProgress(Math.round(current));
    }, 100);
  };

  const stopSimulatedProgress = () => {
    if (simulatorRef.current) {
      clearInterval(simulatorRef.current);
      simulatorRef.current = null;
    }
  };

  // ─── File picker handler ────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);
    setUploadProgress(null);
    setProfileUpdateSuccess(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only JPEG and PNG files are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setUploadError("File size must not exceed 2 MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  // ─── Auto-upload when imageFile changes ─────────────────────────────────────
  useEffect(() => {
    if (!imageFile) return;
    uploadImage(imageFile);

    return () => {
      if (xhrRef.current) xhrRef.current.abort();
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      stopSimulatedProgress();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  // ─── Upload via XHR ──────────────────────────────────────────────────────────
  const uploadImage = (file) => {
    setUploadError(null);
    setUploadSuccess(null);
    setProfileUpdateSuccess(null);
    setUploadProgress(0);
    startSimulatedProgress();

    const formData = new FormData();
    formData.append("profilePicture", file);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    const uploadStartTime = Date.now();
    const MIN_DISPLAY_MS = 2000; // bar always animates for at least 2s

    xhr.addEventListener("load", () => {
      const elapsed = Date.now() - uploadStartTime;
      const delay = Math.max(0, MIN_DISPLAY_MS - elapsed);

      setTimeout(() => {
        stopSimulatedProgress();
        const parsed = safeParseJSON(xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300) {
          dispatch(updateSuccess(parsed));
          setUploadProgress(100);
          setUploadSuccess("Profile picture updated successfully!");
          setImageFile(null);
          setTimeout(() => setUploadProgress(null), 1000);
        } else {
          setUploadError(
            parsed?.message ?? "Failed to upload image. Please try again.",
          );
          setUploadProgress(null);
          setImagePreviewUrl(null);
        }
      }, delay);
    });

    xhr.addEventListener("error", () => {
      stopSimulatedProgress();
      setUploadError("A network error occurred. Please check your connection.");
      setUploadProgress(null);
      setImagePreviewUrl(null);
    });

    xhr.addEventListener("abort", () => {
      stopSimulatedProgress();
      setUploadProgress(null);
    });

    xhr.open("PUT", `/api/user/upload-profile-picture/${currentUser._id}`);
    xhr.withCredentials = true;
    xhr.send(formData);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  const isUploading = uploadProgress !== null && uploadProgress < 100;
  const displayImage = imagePreviewUrl || currentUser.profilePicture;

  // onChange now populates formData so updates can be submitted
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // form now has onSubmit, feedback is shown on success/failure
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProfileUpdateSuccess(null);
    setUploadError(null);
    setUploadSuccess(null);

    // Clear any previous redux error so stale errors don't linger
    if (Object.keys(formData).length === 0) {
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
        setProfileUpdateSuccess("Profile updated successfully!");
        setFormData({}); // reset dirty fields
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess());
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signoutStart());
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signoutFailure(data.message));
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        {/* Avatar with CircularProgressbar ring */}
        <div
          className="relative self-center cursor-pointer"
          style={{ width: 128, height: 128 }}
          onClick={() => !isUploading && filePickerRef.current.click()}
          title={isUploading ? "Uploading…" : "Click to change profile picture"}
        >
          {/* CircularProgressbar forms the ring — photo is clipped inside it */}
          <CircularProgressbar
            value={uploadProgress ?? 0}
            text={isUploading ? `${uploadProgress ?? 0}%` : ""}
            styles={{
              root: { width: "100%", height: "100%" },
              path: {
                stroke: "#7e3af2",
                strokeLinecap: "round",
                transition: "stroke-dashoffset 0.15s ease",
              },
              trail: { stroke: "#e5e7eb" },
              text: {
                fill: "#fff",
                fontSize: "22px",
                fontWeight: "bold",
                dominantBaseline: "middle",
                textAnchor: "middle",
              },
            }}
          />

          {/* Photo sits in the centre of the ring, slightly inset */}
          <img
            src={displayImage}
            alt="Profile"
            className="rounded-full object-cover shadow-md transition-opacity duration-300"
            style={{
              position: "absolute",
              // Inset by the ring stroke so the photo sits inside the ring
              top: isUploading ? 8 : 0,
              left: isUploading ? 8 : 0,
              width: isUploading ? "calc(100% - 16px)" : "100%",
              height: isUploading ? "calc(100% - 16px)" : "100%",
              opacity: isUploading ? 0.55 : 1,
              border: isUploading ? "none" : "6px solid #d1d5db",
              transition: "opacity 0.3s ease",
            }}
          />
        </div>

        {/* Image upload alerts */}
        {uploadError && (
          <Alert color="failure" onDismiss={() => setUploadError(null)}>
            <span className="font-medium">Upload failed: </span>
            {uploadError}
          </Alert>
        )}
        {uploadSuccess && (
          <Alert color="success" onDismiss={() => setUploadSuccess(null)}>
            {uploadSuccess}
          </Alert>
        )}

        {/* Profile update success/error alerts */}
        {profileUpdateSuccess && (
          <Alert
            color="success"
            onDismiss={() => setProfileUpdateSuccess(null)}
          >
            {profileUpdateSuccess}
          </Alert>
        )}
        {error && (
          <Alert
            color="failure"
            onDismiss={() => dispatch(updateFailure(null))}
          >
            <span className="font-medium">Update failed: </span>
            {error}
          </Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="New password"
          autoComplete="new-password"
          onChange={handleChange}
        />

        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          outline
          disabled={isUploading || loading}
        >
          {loading
            ? "Saving…"
            : isUploading
              ? "Uploading photo…"
              : "Update Profile"}
        </Button>

        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span
          className="cursor-pointer hover:underline"
          onClick={() => setShowModal(true)}
        >
          Delete Account
        </span>
        <span
          className="cursor-pointer hover:underline"
          onClick={handleSignout}
        >
          Sign Out
        </span>
      </div>

      {/* Consolidated alerts */}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}

      {/* Delete Account Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              {" "}
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                {" "}
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DashProfile;
