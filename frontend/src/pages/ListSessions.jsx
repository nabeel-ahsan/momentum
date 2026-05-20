import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import EditSessionModal from "../components/EditSessionModal";
import { toast } from "react-toastify";

const ListSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const url = `http://localhost:3000/sessions/getSession/?type=${filterType}&startDate=${startDate}&endDate=&${endDate}`;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result) {
        console.log(result);
        setSessions(result);
      } else {
        return "No sessions to show";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [filterType, startDate, endDate]);

  const editSession = (currentSession) => {
    setSelectedSession(currentSession);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const refreshSessions = async () => {
    await fetchData();
  };

  const handleDelete = async (item) => {
    setLoading(true);
    const id = item._id;
    const url = `http://localhost:3000/sessions/deleteSession/${id}`;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = async() => {
    setFilterType("")
    setStartDate("")
    setEndDate("")
  }

  return (
    <div>
      {loading ? (
        <BounceLoader />
      ) : (
        <div>
          {sessions ? (
            <div>
              <div className="filter">
                <p>Filter By:</p>
                <label>Type</label>
                <select value={filterType} onChange={(e)=> setFilterType(e.target.value)}>
                  <option value="None"></option>
                  <option value="Development">Development</option>
                  <option value="DSA">DSA</option>
                  <option value="Applications">Applications</option>
                  <option value="Learning">Learning</option>
                  <option value="Other">Other</option>
                </select>
                <label >Start Date</label>
                <input type="date" value={startDate} onChange={(e)=> setStartDate(e.target.value)}/>
                <label >End Date</label>
                <input type="date" value={endDate} onChange={(e)=> setEndDate(e.target.value)}/>
                <button onClick={fetchData}>Filter</button>
                <button onClick={resetFilter}>Reset</button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th className="table-header">Title</th>
                    <th className="table-header">Type</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Duration</th>
                    <th className="table-header">Notes</th>
                    <th className="table-header">Link</th>
                    <th className="table-header">Created At</th>
                    <th className="table-header">Update</th>
                    <th className="table-header">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.type}</td>
                        <td>{item.status}</td>
                        <td>{`${String(Math.floor(item.duration / 60)).padStart(2, "0")}H:${String(Math.floor(item.duration % 60)).padStart(2, "0")}M`}</td>
                        <td>{item.notes ? item.notes : "-"}</td>
                        <td>{item.link ? item.link : "-"}</td>
                        <td>
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              editSession(item);
                            }}
                          >
                            Update
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              handleDelete(item);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            "No Sessions Yet!"
          )}
        </div>
      )}
      {isModalOpen && selectedSession && (
        <EditSessionModal
          isModalOpen={isModalOpen}
          session={selectedSession}
          onClose={closeModal}
          onUpdateSuccess={refreshSessions}
        />
      )}
    </div>
  );
};

export default ListSessions;
