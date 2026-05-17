import { useState } from "react";
import { toast } from "react-toastify";

const AddSessions = () => {
  const [type, setType] = useState("Development");
  const [status, setStatus] = useState("In Progress");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(""); 
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const postSession = async () => {
    setLoading(true);
    const getToken = localStorage.getItem("token");
    const token = JSON.parse(getToken);
    const url = "http://localhost:3000/sessions/addSession";
    let durationInMinutes = 0;
    if (duration) {
      const [hours, minutes] = duration.split(':').map(Number);
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
        console.log("response:", response);
        console.log("result: ", result);
        setType('Development')
        setStatus('In Progress') // Resetting to initial values after successful submission
        setTitle("");
        setDuration("");
        setNotes("");
        setLink("");
        toast.success("Session Successfully Created!");
      }else{
        console.error("Error response from server:", result); // Log the detailed error message from the backend
        toast.error(result.message || "Error creating session!"); // Display specific error if available, otherwise a generic one
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating session!");
    } finally {
      setLoading(false);
    }
  };

  const validateData = () => {
    if (!title || duration === "") { // Check if title is empty or duration is an empty string
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
    <>
      <div className="form">
        <div>
          <h1>Create Session</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Development">Dev</option>
            <option value="DSA">DSA</option>
            <option value="Applications">Applications</option>
            <option value="Learning">Learning</option>
            <option value="Other">Other</option>
          </select>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Duration</label>
          <input
            type="time"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
          <label>Link</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddSessions;
