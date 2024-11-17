import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventData, setEventData] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prevData => (prevData ? { ...prevData, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!eventData) return;

    try {
      if (isEditing) {
        await axios.put(`/api/events/${eventData.id}`, eventData);
        Swal.fire("Success", "Event updated successfully", "success");
      } else {
        await axios.post("/api/events", eventData);
        Swal.fire("Success", "Event created successfully", "success");
      }
      fetchEvents();
      setEventData(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving event", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handleEdit = (event: Event) => {
    setEventData(event);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/events/${id}`);
      Swal.fire("Deleted!", "Event has been deleted.", "success");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event", error);
      Swal.fire("Error", "Failed to delete event", "error");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={eventData?.title || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={eventData?.date || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={eventData?.description || ""}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{isEditing ? "Update Event" : "Create Event"}</button>
      </form>

      <h3>Events List</h3>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <h4>{event.title}</h4>
            <p>{event.date}</p>
            <p>{event.description}</p>
            <button onClick={() => handleEdit(event)}>Edit</button>
            <button onClick={() => handleDelete(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
