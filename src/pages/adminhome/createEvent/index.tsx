import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import { EventsCreate } from "../../../models/models";

const CreateEventPage: React.FC = () => {
	const router = useRouter();
	const [formData, setFormData] = useState<Partial<EventsCreate>>({
		event_name: "",
		location: "",
		description: "",
		event_date: "",
		ticket_available: 0,
		price: 0,
		image: undefined,
	});

	const [isLoading, setIsLoading] = useState(false); // Add loading state

	const handleBackClick = () => {
		router.push("/adminhome");
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true); // Start loading

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
		if (formData.image) {
			updatedFormData.append("image", formData.image);
		}

		const accessToken = Cookies.get("access_token");
		try {
			await axios.post("/api/admin/events", updatedFormData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "multipart/form-data",
				},
			});
			Swal.fire(
				"Created!",
				"Event has been created. You will be prompted back to admin-dashboard",
				"success"
			).then(() => {
				router.push("/adminhome");
			});
			resetForm();
		} catch (error) {
			const err = error as Error;
			Swal.fire(
				"Error!",
				"Failed to save event. " + (err.message || err.message),
				"error"
			);
		} finally {
			setIsLoading(false); // Stop loading after the request completes
		}
	};

	const resetForm = () => {
		setFormData({
			event_name: "",
			location: "",
			description: "",
			event_date: "",
			ticket_available: 0,
			price: 0,
			image: undefined,
		});
	};

	return (
		<div className="container mx-auto p-4 w-screen h-s">
			<h1 className="text-3xl font-bold mb-4 justify-center flex">
				Create Event Form
			</h1>
			<button
				className="bg-yellow-500 text-black py-2 px-4 my-4 rounded hover:text-white hover:bg-yellow-600 flex items-center"
				onClick={handleBackClick}
			>
				<FaArrowLeft className="mr-2" /> BACK TO ADMIN HOMEPAGE
			</button>

			{isLoading && (
				<div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
					<img src="/loading.gif" alt="Loading..." className="w-24 h-24" />
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 shadow-lg mb-4 border"
			>
				<div>
					<label>Event Name</label>
					<input
						type="text"
						name="event_name"
						value={formData.event_name}
						onChange={handleInputChange}
						placeholder="Event Name"
						required
						className="block w-full p-2 mb-4 border rounded"
					/>
				</div>

				<div>
					<label>Location</label>
					<input
						type="text"
						name="location"
						value={formData.location}
						onChange={handleInputChange}
						placeholder="Location"
						required
						className="block w-full p-2 mb-4 border rounded"
					/>
				</div>

				<div>
					<label>Description</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleInputChange}
						placeholder="Description"
						required
						className="block w-full p-2 mb-4 border rounded"
					/>
				</div>

				<div>
					<label>Event Date</label>
					<p className="my-1 text-sm ">
						*Please make sure your date is not due passed
					</p>
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
					<label>Event Type</label>
					<p className="my-1 text-sm ">
						*Please change the Event-Type to Completed if the Event is done
					</p>
					<select
						name="event_type"
						value={formData.event_type}
						onChange={handleInputChange}
						className="w-full p-2 border border-gray-300 rounded"
					>
						<option value="">Select Event Type</option>
						<option value="Exhibition">Exhibition</option>
						<option value="Theater">Theater</option>
						<option value="Festival">Festival</option>
						<option value="Performing">Performing</option>
						<option value="Completed">Completed</option>
					</select>
				</div>

				<div className="my-4">
					<label>Tickets Available</label>
					<input
						type="number"
						name="ticket_available"
						value={formData.ticket_available}
						onChange={handleInputChange}
						placeholder="Tickets Available"
						required
						className="block w-full p-2 mb-4 border rounded"
					/>
				</div>

				<div>
					<label>Price in Rupiah</label>
					<p className="my-1 text-sm ">*Please put 0 rupiah for free event</p>
					<input
						type="number"
						name="price"
						value={formData.price}
						onChange={handleInputChange}
						placeholder="Price"
						required
						className="block w-full p-2 mb-4 border rounded"
					/>
				</div>

				<div>
					<label>Image</label>
					<input
						type="file"
						name="image"
						onChange={handleFileChange}
						placeholder="Upload Image"
						className="block w-full p-2 mb-4 border rounded"
						required
					/>
				</div>

				<button
					type="submit"
					className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
				>
					Create Event
				</button>
			</form>
		</div>
	);
};

export default CreateEventPage;
