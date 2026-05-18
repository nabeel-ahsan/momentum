import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditSessionModal = ({
  isModalOpen,
  session,
  onClose,
  onUpdateSuccess,
}) => {
  if (!session) return null;

  const [type, setType] = useState(session.type);
  const [status, setStatus] = useState(session.status);
  const [title, setTitle] = useState(session.title);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState(session.notes);
  const [link, setLink] = useState(session.link);
  const [loading, setLoading] = useState(false);

  const id = session._id;
  console.log(id);

  useEffect(() => {
    const hours = Math.floor(session.duration / 60);
    const minutes = session.duration % 60;
    const finalDuration = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    setType(session.type);
    setStatus(session.status);
    setTitle(session.title);
    setDuration(finalDuration);
    setNotes(session.notes);
    setLink(session.link);
  }, [session]);

  const editSession = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const url = `http://localhost:3000/sessions/updateSession/${id}`;
    console.log("TOKEN:", token);

    let durationInMinutes = 0;
    if (duration) {
      const [hours, minutes] = duration.split(":").map(Number);
      durationInMinutes = hours * 60 + minutes;
    }
    try {
      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({
          type: type,
          status: status,
          title: title,
          duration: durationInMinutes,
          notes: notes,
          link: link,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        onUpdateSuccess();
        onClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const validateData = () => {
    if (!title || duration === "") {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateData()) {
      await editSession();
    }
  };

  return (
    <>
      <div className="form">
        <div>
          <h1>Create Session</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="label">Type</label>
          <select
            value={type}
            className="input"
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Development">Dev</option>
            <option value="DSA">DSA</option>
            <option value="Applications">Applications</option>
            <option value="Learning">Learning</option>
            <option value="Other">Other</option>
          </select>
          <label className="label">Status</label>
          <select
            value={status}
            className="input"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <label className="label">Title</label>
          <input
            className="input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="label">Duration</label>
          <input
            className="input"
            type="time"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <label className="label">Notes</label>
          <textarea
            className="input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
          <label className="label">Link</label>
          <input
            type="url"
            className="input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditSessionModal;
