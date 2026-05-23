import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X, Save } from "lucide-react";
import styles from "../utils/styles";

const EditSessionModal = ({
  isModalOpen,
  session,
  onClose,
  onUpdateSuccess,
}) => {
  if (!isModalOpen || !session) return null;

  const [type, setType] = useState(session.type);
  const [status, setStatus] = useState(session.status);
  const [title, setTitle] = useState(session.title);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState(session.notes);
  const [link, setLink] = useState(session.link);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const id = session._id;

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
    const url = `${API_BASE_URL}/api/sessions/updateSession/${id}`;

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
        toast.success(result.message || "Session Updated Successfully!");
        onUpdateSuccess();
        onClose();
      } else {
        toast.error(result.message || "Error updating log transaction!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error communicating with authentication server!");
    } finally {
      setLoading(false);
    }
  };

  const validateData = () => {
    if (!title || duration === "") {
      toast.error("Title and duration limits cannot be left empty.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg bg-[#0d0d0e] border border-zinc-800 p-6 md:p-8 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] z-10 animate-in zoom-in-95 duration-200">
        <header className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Modify Session Log
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Update task data information properties
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`${styles.button.ghost} text-zinc-500 hover:text-white p-1`}
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={styles.label}>Category Type</label>
              <select
                value={type}
                className={styles.input}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Development">Dev</option>
                <option value="DSA">DSA</option>
                <option value="Applications">Applications</option>
                <option value="Learning">Learning</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Current Status</label>
              <select
                value={status}
                className={styles.input}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className={styles.label}>Task Title</label>
            <input
              className={styles.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={styles.label}>Focused Duration Block</label>
            <input
              className={styles.input}
              type="time"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={styles.label}>Log Development Notes</label>
            <textarea
              rows={4}
              className={`${styles.input} resize-none`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="No notes appended..."
            />
          </div>

          <div>
            <label className={styles.label}>Reference Documentation URL</label>
            <input
              type="url"
              className={styles.input}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80 mt-8">
            <button
              type="button"
              onClick={onClose}
              className={`${styles.button.secondary} w-1/3`}
            >
              Cancel
            </button>
            <button
              className={`${styles.button.primary} w-2/3`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Updating changes..."
              ) : (
                <>
                  <Save size={14} /> Save Modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSessionModal;
