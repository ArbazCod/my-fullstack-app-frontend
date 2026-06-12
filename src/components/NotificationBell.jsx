import { FaBell } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { fetchNotifications, markNotificationRead } from "../api/notification";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef();
  const navigate = useNavigate();

  // LOAD notifications
  const load = async () => {
    try {
      const res = await fetchNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.log("Notification fetch error");
    }
  };

  // FIRST LOAD + AUTO REFRESH EVERY 10 SEC
  useEffect(() => {
    load();

    const interval = setInterval(() => {
      load();
    }, 5000); // ✅ 10 seconds

    return () => clearInterval(interval);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const handleClick = async (n) => {
    await markNotificationRead(n._id);

    setNotifications(prev =>
      prev.map(x =>
        x._id === n._id ? { ...x, read: true } : x
      )
    );

    navigate(n.link);
    setOpen(false);
  };

  // CLOSE WHEN CLICK OUTSIDE
  useEffect(() => {
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () =>
      document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={boxRef}>
      <FaBell
        onClick={() => setOpen(!open)}
        className="text-xl cursor-pointer"
      />

      {unread > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            background: "red",
            color: "white",
            fontSize: "10px",
            padding: "2px 5px",
            borderRadius: "50%"
          }}
        >
          {unread}
        </span>
      )}

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: "10px",
            width: "300px",
            background: "white",
            color: "black",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,.2)",
            zIndex: 100
          }}
        >
          <div
            style={{
              padding: "10px",
              fontWeight: "bold",
              borderBottom: "1px solid #ddd"
            }}
          >
            Notifications
          </div>

          {notifications.length === 0 ? (
            <p style={{ padding: "10px", fontSize: "14px" }}>
              No notifications
            </p>
          ) : (
            notifications.map(n => (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                style={{
                  padding: "10px",
                  fontSize: "13px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  background: !n.read ? "#e0f2fe" : "white"
                }}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

