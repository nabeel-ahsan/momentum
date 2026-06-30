import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "../utils/styles";
import { useAuth } from "../context/AuthProvider";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const AddSessions = ({ onCloseDrawer, onAddSuccess }) => {
  const [type, setType] = useState("Development");
  const [status, setStatus] = useState("In Progress");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const postSession = async () => {
    setLoading(true);

    const API_BASE_URL = import.meta.env.VITE_API_URL;
const url = `${API_BASE_URL}/api/v1/sessions`;
    let durationInMinutes = 0;
    if (duration) {
      const [hours, minutes] = duration.split(":").map(Number);
      durationInMinutes = hours * 60 + minutes;
    }
    try {
      const response = await fetch(url, {
        method: "POST",
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
        setType("Development");
        setStatus("In Progress");
        setTitle("");
        setDuration("");
        setNotes("");
        setLink("");
        toast.success("Session Successfully Created!");
        if (onAddSuccess) onAddSuccess();
        if (onCloseDrawer) onCloseDrawer();
      } else {
        toast.error(result.message || "Error creating session!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating session!");
    } finally {
      setLoading(false);
    }
  };

  const validateData = () => {
    if (!title) {
      toast.error("Please enter a valid session title.");
      return false;
    }

    if (!duration || duration === "00:00") {
      toast.error("Duration must be a positive time block (min 1 minute).");
      return false;
    }

    const [hours, minutes] = duration.split(":").map(Number);
    if (hours === 0 && minutes === 0) {
      toast.error("Duration must be a positive time block (min 1 minute).");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateData()) {
      await postSession();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={styles.label}>Type</label>
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
          <label className={styles.label}>Status</label>
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
        label="Session Task Title"
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Slidewindow Matrix optimization"
        required
      />

      <Input
        label="Duration (Hours : Minutes)"
        id="duration"
        type="time"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        required
      />

      <div>
        <label className={styles.label}>Engineering Notes (Optional)</label>
        <textarea
          rows={4}
          className={`${styles.input} resize-none`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add code details, optimizations or blockers..."
        />
      </div>

      <Input
        label="Reference Material Link (Optional)"
        id="link"
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="https://leetcode..."
      />

      <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/60 mt-8">
        <Button
          type="button"
          onClick={onCloseDrawer}
          variant="secondary"
          className="w-1/3"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="w-2/3"
          loading={loading}
        >
          Save Log Entry
        </Button>
      </div>
    </form>
  );
};

export default AddSessions;
