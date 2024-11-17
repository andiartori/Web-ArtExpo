import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useAuth } from "@/utils/hooks/useAuth";
import { EventsDelete } from "@/models/models";

import { FaArrowLeft } from "react-icons/fa";

const EditDeleteEvents: React.FC = () => {
	useAuth();
	const [events, setEvents] = useState<EventsDelete[]>([]);
	const [noResults, setNoResults] = useState(false);
	const [editingEvent, setEditingEvent] = useState<EventsDelete | null>(null);
	const [formData, setFormData] = useState<Partial<EventsDelete>>({
		event_id: 0,
		event_name: "",
		location: "",
		description: "",
		event_date: "",
		ticket_available: 0,
		price: 0,
		image: undefined,
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();

	// Fetch all events initially
	const fetchEvents = async () => {
		const accessToken = Cookies.get("access_token");
		try {
			const response = await axios.get(`/api/admin/events`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			if (Array.isArray(response.data.data)) {
				setEvents(response.data.data);
				setNoResults(false);
			} else {
				console.error("Unexpected data format:", response.data);
				setNoResults(true);
			}
		} catch (error) {
			console.log(error);
			setNoResults(true);
		}
	};

	const handleEdit = (event: EventsDelete) => {
		const formattedDate = new Date(event.event_date)
			.toISOString()
			.split("T")[0];
		setEditingEvent(event);
		setFormData({
			...event,
			image: event.image,
			event_date: formattedDate, // Format the date to "YYYY-MM-DD"
		});
		setIsModalOpen(true); // Open modal
	};

	const handleDelete = async (event_id: number) => {
		const accessToken = Cookies.get("access_token");

		// Show confirmation dialog
		const result = await Swal.fire({
			title: "NOT ADVISED! Are you sure?",
			text: "Do you want to delete this event? This action cannot be undone All Records Payments and Bookings will be lost.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel",
		});

		// If the user confirms, proceed with deletion
		if (result.isConfirmed) {
			try {
				await axios.delete(`/api/admin/events/${event_id}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				Swal.fire("Deleted!", "Event has been deleted.", "success");
				fetchEvents();
			} catch (error) {
				console.error("Error deleting event", error);
				Swal.fire("Error!", "Failed to delete event.", "error");
			}
		} else {
			// User canceled the deletion
			Swal.fire("Cancelled", "The event was not deleted.", "info");
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const isoDate = new Date(formData.event_date || "").toISOString();
		const updatedFormData = new FormData();
		updatedFormData.append("event_name", formData.event_name || "");
		updatedFormData.append("location", formData.location || "");
		updatedFormData.append("description", formData.description || "");
		updatedFormData.append("event_date", isoDate);
		updatedFormData.append("event_type", formData.event_type || "Exhibition");
		updatedFormData.append(
			"ticket_available",
			String(formData.ticket_available || 0)
		);
		updatedFormData.append("price", String(formData.price || 0));
		// Handle the image field
		// Handle the image field
		if (formData.image && typeof formData.image !== "string") {
			updatedFormData.append("image", formData.image); // Append the new file
		} else if (editingEvent?.image && !formData.image) {
			updatedFormData.append("image", editingEvent.image); // Append the existing image URL
		}
		const accessToken = Cookies.get("access_token");

		try {
			await axios.put(
				`/api/admin/events/${editingEvent?.event_id}`,
				updatedFormData,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);
			Swal.fire("Updated!", "Event has been updated.", "success");
			fetchEvents();
			setIsModalOpen(false); // Close modal after submit
		} catch (error) {
			const err = error as Error;
			// console.error("Error updating event", error);
			Swal.fire("Error!", "Failed to update event." + err.message);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : undefined;
		setFormData({ ...formData, image: file });
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	// Get unique event types for categorization
	const uniqueEventTypes = Array.from(
		new Set(events.map((event) => event.event_type))
	);

	const handleBackClick = () => {
		router.push("/adminhome");
	};
	return (
		<div className="container mx-auto p-4">
			<div className="">
				<h1 className="text-3xl font-bold mb-4 flex justify-center items-center">
					Event List - Edit / Delete
				</h1>
				<div className="flex justify-center">
					<button
						className="bg-yellow-500 text-black py-2 px-4 my-4 rounded hover:text-white hover:bg-yellow-600 flex"
						onClick={handleBackClick}
					>
						<FaArrowLeft className="mr-2" /> BACK TO ADMIN HOMEPAGE
					</button>
				</div>
			</div>

			{noResults ? (
				<p className="text-center text-red-500">No events found</p>
			) : (
				// Map through each unique event type
				uniqueEventTypes.map((type) => (
					<div key={type} className="mb-6">
						<h2 className="text-2xl font-semibold mb-4 flex justify-start">
							Type of event : {type}
						</h2>
						<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
							{events
								.filter((event) => event.event_type === type)
								.map((event, index) => (
									<li key={index} className="bg-white p-4 rounded shadow-md">
										<img
											src={
												event.image instanceof File
													? URL.createObjectURL(event.image) // Convert File to a URL
													: event.image || "/default-placeholder.png" // Use string URL or a fallback placeholder
											}
											alt={event.event_name || "Event Image"}
											className="w-full h-32 object-cover mb-4 rounded"
										/>
										<h3 className="text-xl font-semibold">
											{event.event_name}
										</h3>
										<p>{event.description}</p>
										<p>Type : {event.event_type}</p>
										<p className="text-gray-600">Location: {event.location}</p>
										<p className="text-gray-600">Date: {event.event_date}</p>
										<p className="text-gray-600">
											Tickets Available: {event.ticket_available}
										</p>
										<p className="text-gray-600">
											Price: Rp. {event.price.toLocaleString()}
										</p>
										<div className="flex justify-between">
											<button
												onClick={() => handleEdit(event)}
												className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 w-full"
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(event.event_id)}
												className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 w-full"
											>
												Delete
											</button>
										</div>
									</li>
								))}
						</ul>
					</div>
				))
			)}

			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
						<h2 className="text-2xl mb-4">Edit Event</h2>
						<form onSubmit={handleSubmit}>
							<div>
								Event Name
								<input
									type="text"
									name="event_name"
									value={formData.event_name}
									onChange={handleInputChange}
									required
									className="block w-full p-2 mb-4 border rounded"
								/>
							</div>
							<div>
								Location
								<input
									type="text"
									name="location"
									value={formData.location}
									onChange={handleInputChange}
									required
									className="block w-full p-2 mb-4 border rounded"
								/>
							</div>
							<div>
								Description
								<textarea
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									required
									className="block w-full p-2 mb-4 border rounded"
								/>
							</div>
							<div>
								Event Date
								<input
									type="date"
									name="event_date"
									value={formData.event_date}
									onChange={handleInputChange}
									required
									className="block w-full p-2 mb-4 border rounded"
								/>
							</div>
							<div>
								Event Type
								<select
									name="event_type"
									value={formData.event_type}
									onChange={handleInputChange}
									className="w-full p-2 border border-gray-300 rounded mb-4"
								>
									<option value="Exhibition">Exhibition</option>
									<option value="Theater">Theater</option>
									<option value="Festival">Festival</option>
									<option value="Performing">Performing</option>
									<option value="Completed">Completed</option>
								</select>
							</div>
							<div>
								Tickets Available
								<input
									type="number"
									name="ticket_available"
									value={formData.ticket_available}
									onChange={handleInputChange}
									required
									className="block w-full p-2 mb-4 border rounded"
								/>
							</div>
							<div>
								Price
								<input
									type="number"
									name="price"
									value={formData.price}
									onChange={handleInputChange}
									required
									className="block w-full p-2 mb-4 border rounded"
								/>
							</div>
							<div>
								Image
								<input
									type="file"
									name="image"
									onChange={handleFileChange}
									className="block w-full p-2 mb-4 border rounded"
								/>
							</div>
							<div className="flex justify-end">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 mr-2"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
								>
									Update Event
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default EditDeleteEvents;
