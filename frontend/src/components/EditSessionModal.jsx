import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Save } from "lucide-react";
import styles from "../utils/styles";
import { useAuth } from "../context/AuthProvider";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Button from "./ui/Button";

const EditSessionModal = ({
  isModalOpen,
  session,
  onClose,
  onUpdateSuccess,
}) => {
  const [type, setType] = useState(session.type);
  const [status, setStatus] = useState(session.status);
  const [title, setTitle] = useState(session.title);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState(session.notes);
  const [link, setLink] = useState(session.link);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const id = session._id;
  const { token } = useAuth();

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
    const url = `${API_BASE_URL}/api/v1/sessions/${id}`;

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
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      title="Modify Session Log"
      subtitle="Update task data information properties"
    >
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

        <Input
          label="Task Title"
          id="edit-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          label="Focused Duration Block"
          id="edit-duration"
          type="time"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

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

        <Input
          label="Reference Documentation URL"
          id="edit-link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
        />

        <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80 mt-8">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="w-1/3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="w-2/3"
            loading={loading}
            iconBefore={<Save size={14} />}
          >
            Save Modifications
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSessionModal;
