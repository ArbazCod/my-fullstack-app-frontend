import api from "./axiosClient";

export const fetchNotifications = () =>
  api.get("/notifications");

export const markNotificationRead = (id) =>
  api.put(`/notifications/${id}/read`);
