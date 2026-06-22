import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import EditSessionModal from "../components/EditSessionModal";
import { toast } from "react-toastify";
import {
  Calendar,
  RotateCcw,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  MoveLeft,
  MoveRight,
} from "lucide-react";
import styles from "../utils/styles";
import { useAuth } from "../context/AuthProvider";
import SessionChart from "../components/SessionChart";

const Tag = ({ type }) => {
  const base =
    "px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide border";
  const map = {
    DSA: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Development: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Applications: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Learning: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    default: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  return <span className={`${base} ${map[type] || map.default}`}>{type}</span>;
};

const StatusDot = ({ status }) => {
  const map = {
    Completed: "text-emerald-500",
    "In Progress": "text-blue-400",
    Backlog: "text-zinc-500",
  };
  return (
    <span
      className={`text-[11px] font-bold tracking-wide ${map[status] || "text-zinc-400"}`}
    >
      • {status}
    </span>
  );
};

const ListSessions = () => {
  const currentYYYYMM = new Date().toISOString().slice(0, 7);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(currentYYYYMM);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { refreshSignal } = useOutletContext();

  const context = useOutletContext();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const limit = 20;
  const fetchData = async () => {
    setLoading(true);
    const url = `${API_BASE_URL}/api/v1/sessions/?type=${filterType}&startDate=${startDate}&endDate=${endDate}&month=${selectedMonth}&page=${currentPage}&limit=${limit}`;
    try {
      const response = await fetch(url, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (Array.isArray(result.sessions)) {
        setSessions(result.sessions);
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
        console.log(result);
      } else {
        setSessions([]);
      }
    } catch (error) {
      toast.error("Failed to fetch session history.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    const url = `${API_BASE_URL}/api/v1/sessions/stats/?month=${selectedMonth}`;
    try {
      const response = await fetch(url, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (
        typeof result === "object" &&
        result !== null &&
        !Array.isArray(result)
      ) {
        setStats(result);
      } else {
        setStats({});
      }
    } catch (error) {
      toast.error("Failed to load activity statistics.");
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    filterType,
    startDate,
    endDate,
    refreshSignal,
    token,
    selectedMonth,
    currentPage,
  ]);

  useEffect(() => {
    fetchStats();
  }, [filterType, startDate, endDate, refreshSignal, token, selectedMonth]);

  useEffect(() => {
    if (context) {
      context.triggerGlobalDrawerRefresh = () => fetchData();
    }
  }, [context]);

  const editSession = (currentSession) => {
    setSelectedSession(currentSession);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Confirm transaction log deletion permanently?"))
      return;
    setLoading(true);
    const id = item._id;
    const url = `${API_BASE_URL}/api/v1/sessions/${id}`;
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
        toast.success(result.message || "Session Deleted");
        fetchData();
      } else {
        toast.error(result.message || "Failed to delete session.");
      }
    } catch (error) {
      toast.error("Connection error during deletion.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => {
    setFilterType("");
    setStartDate("");
    setEndDate("");
  };

  const totalSessions = stats?.totalSessions || 0;
  const totalDuration = stats?.totalDuration || 0;
  const hours = String(Math.floor(totalDuration / 60)).padStart(2, "0");
  const minutes = String(totalDuration % 60).padStart(2, "0");
  const dsaCount = stats?.sessionsByType?.DSA || 0;
  const devCount = stats?.sessionsByType?.Development || 0;
  const appCount = stats?.sessionsByType?.Applications || 0;

  const chartData = [
    { name: "DSA", count: dsaCount },
    { name: "Development", count: devCount },
    { name: "Applications", count: appCount },
  ];

  const getPageNumbers = () => {
    const pages = [];
    const siblingCount = 1; 

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages ||
        (i >= currentPage - siblingCount && i <= currentPage + siblingCount) 
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("..."); 
      }
    }
    return pages;
  };

  return (
    <div className="space-y-8 flex-1 flex flex-col">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className={`${styles.card} p-5`}>
          <p className={styles.label}>Logged Blocks</p>
          <p className="text-3xl font-extrabold mt-1.5">{totalSessions}</p>
        </div>
        <div className={`${styles.card} p-5`}>
          <p className={styles.label}>DSA Count</p>
          <p className="text-3xl font-extrabold mt-1.5 text-purple-400">
            {dsaCount}
          </p>
        </div>
        <div className={`${styles.card} p-5`}>
          <p className={styles.label}>Dev Metrics</p>
          <p className="text-3xl font-extrabold mt-1.5 text-emerald-400">
            {devCount}
          </p>
        </div>
        <div className={`${styles.card} p-5`}>
          <p className={styles.label}>Total Focused Hours</p>
          <p className="text-3xl font-extrabold mt-1.5 text-blue-400">
            {`${hours}H${minutes}M`}
          </p>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-neutral-800/60 bg-[#111111] p-5 shadow-xl">
        <div className="mb-4">
          <h3 className="text-base font-semibold tracking-wide text-neutral-200">
            Activity Distribution
          </h3>
          <p className="text-xs text-neutral-500">
            Visual breakdown of logged focus blocks by category.
          </p>
        </div>

        <div className="h-[300px] w-full">
          <SessionChart chartData={chartData} />
        </div>
      </section>

      <section className="flex flex-col xl:flex-row items-center justify-between gap-4 border border-zinc-800 bg-[#0d0d0e]/50 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-start">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`${styles.input} !p-2 text-xs !w-auto`}
          >
            <option value="">All Categories</option>
            <option value="Development">Development</option>
            <option value="DSA">DSA</option>
            <option value="Applications">Applications</option>
            <option value="Learning">Learning</option>
            <option value="Other">Other</option>
          </select>

          <div className="flex items-center gap-2 bg-[#0d0d0e] border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-400 text-xs">
            <span className="text-zinc-600 font-bold uppercase text-[10px]">
              Start
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-zinc-200 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#0d0d0e] border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-400 text-xs">
            <span className="text-zinc-600 font-bold uppercase text-[10px]">
              End
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-zinc-200 outline-none"
            />
          </div>
          <div className="flex items-center gap-2 bg-[#0d0d0e] border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-400 text-xs">
            <span className="text-zinc-600 font-bold uppercase text-[10px]">
              Month
            </span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-zinc-200 outline-none"
            />
          </div>

          <button
            onClick={resetFilter}
            className={`${styles.button.ghost} text-xs !p-2`}
            type="button"
          >
            <RotateCcw size={13} /> Reset Filter
          </button>
        </div>
      </section>

      <section
        className={`${styles.card} overflow-hidden flex-1 flex flex-col min-h-[300px]`}
      >
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-20">
            <BounceLoader color="#ffffff" />
          </div>
        ) : sessions.length > 0 ? (
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/10 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <th className="p-4 pl-6">Title Task</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4 w-1/4">Notes Log</th>
                  <th className="p-4 text-center">Ref</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium divide-y divide-zinc-800/40">
                {sessions.map((item) => (
                  <tr
                    key={item._id || item.id}
                    className="hover:bg-zinc-900/40 transition-colors"
                  >
                    <td className="p-4 pl-6 font-semibold text-white truncate max-w-[180px]">
                      {item.title}
                    </td>
                    <td className="p-4">
                      <Tag type={item.type} />
                    </td>
                    <td className="p-4">
                      <StatusDot status={item.status} />
                    </td>
                    <td className="p-4 text-zinc-300 font-mono text-xs">
                      {`${String(Math.floor((item.duration || 0) / 60)).padStart(2, "0")}H:${String(Math.floor((item.duration || 0) % 60)).padStart(2, "0")}M`}
                    </td>
                    <td className="p-4 text-xs text-zinc-400 max-w-[200px] truncate">
                      {item.notes || "-"}
                    </td>
                    <td className="p-4 text-center">
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-500 hover:text-purple-400 inline-block p-1"
                        >
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-4 text-xs text-zinc-500">
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => editSession(item)}
                          className={styles.button.icon}
                          type="button"
                          disabled={loading}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={loading}
                          className={`${styles.button.icon} hover:text-red-400`}
                          type="button"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div
                className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800 bg-[#0d0d0e]/20 px-6 py-4 gap-4"
              >
                <p className="text-xs text-zinc-500 font-medium">
                  Showing page{" "}
                  <span className="text-zinc-300 font-semibold">
                    {currentPage}
                  </span>{" "}
                  of
                  <span className="text-zinc-350 font-semibold">
                    {totalPages}
                  </span>
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1 || loading}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:bg-zinc-800/80 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    type="button"
                  >
                    Previous
                  </button>
                  {getPageNumbers().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipse-${index}`}
                          className="h-8 w-8 flex items-center justify-center text-xs text-zinc-600 select-none cursor-default"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={`page-${page}`}
                        onClick={() => setCurrentPage(page)}
                        disabled={loading}
                        className={
                          page === currentPage
                            ? "h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold bg-white text-black shadow-md shadow-white/5"
                            : "h-8 w-8 flex items-center justify-center rounded-lg text-xs font-medium text-zinc-500 hover:text-white hover:bg-zinc-800/50 transition-all"
                        }
                        type="button"
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages || loading}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:bg-zinc-800/80 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm font-medium p-20">
            No Sessions Found!
          </div>
        )}
      </section>

      {isModalOpen && selectedSession && (
        <EditSessionModal
          isModalOpen={isModalOpen}
          session={selectedSession}
          onClose={closeModal}
          onUpdateSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default ListSessions;
