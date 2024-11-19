import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import debounce from "lodash.debounce";
import { Events, Reviews } from "@/models/models";
import Aos from "aos";
import "aos/dist/aos.css";
import { Quicksand } from "next/font/google";
import { Great_Vibes } from "next/font/google";
import Image from "next/image";
import Carousel from "@/components/carousel";
import { WavyBackground } from "@/components/ui/wavy-background";
import Head from "next/head";

const quickSand = Quicksand({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});
const greatVibes = Great_Vibes({
	weight: "400",
	subsets: ["latin"],
});

function Home() {
	const router = useRouter();
	const [events, setEvents] = useState<Events[]>([]);
	const [reviews, setReviews] = useState<Reviews[]>([]);
	const [noResults, setNoResults] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedEventType, setSelectedEventType] = useState(""); // State for event type
	const [currentEventPage, setCurrentEventPage] = useState(1);
	const [currentReviewPage, setCurrentReviewPage] = useState(1);
	const [hasMoreEvents, setHasMoreEvents] = useState(true);
	const [hasMoreReviews, setHasMoreReviews] = useState(true);

	// Debounced function to fetch events based on search term and category
	const fetchEvents = debounce(async (term, category) => {
		if (!term && !category) {
			getAllEvents(); // Fetch all events if search term and category are empty
			return;
		}

		try {
			const response = await axios.get(
				`/api/search?term=${term}&category=${category}`
			);
			setEvents(response.data.data);
			setNoResults(response.data.data.length === 0);
		} catch (error) {
			// Handle error safely using AxiosError type guard
			if (axios.isAxiosError(error)) {
				if (error.response && error.response.status === 404) {
					setEvents([]); // Clear events if none found
					setNoResults(true); // Set noResults to true if 404
				}
			} else {
				console.error("Error searching events:", error);
			}
		}
	}, 500); // 500ms delay for debounce

	// Handler to update search term and trigger debounced fetch
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const term = event.target.value;
		setSearchTerm(term);
		fetchEvents(term, selectedEventType);
	};
	const handleCategoryChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const category = event.target.value;
		setSelectedEventType(category);
		fetchEvents(searchTerm, category);
	};

	// Function to fetch events with pagination

	async function getEvents(page = 1) {
		try {
			const response = await axios.get(`/api/events?page=${page}&limit=6`);

			if (Array.isArray(response.data?.data)) {
				const events = response.data.data;

				if (events.length > 0) {
					if (page === 1) {
						setEvents(events);
					} else if (events.length === 0) {
					} else {
						setEvents((prevEvents) => [...prevEvents, ...events]);
					}
				} else if (events.length === 0) {
				} else {
				}
			} else {
			}
		} catch (error) {
			console.error("Error fetching events:", error);
			setHasMoreEvents(false); // Set noResults to true if there's an error
		}
	}

	// Function to fetch events with pagination
	// async function getEvents(page = 1) {
	// 	try {
	// 		const response = await axios.get(`/api/events?page=${page}&limit=6`);

	// 		// Ensure response.data.data is an array and handle empty response data gracefully
	// 		if (Array.isArray(response.data?.data)) {
	// 			if (response.data.data.length > 0) {
	// 				if (page === 1) {
	// 					setEvents(response.data.data); // Update with new events
	// 				} else {
	// 					setEvents((prevEvents) => [...prevEvents, ...response.data.data]); // Append events
	// 				}

	// 				setHasMoreEvents(response.data.data.length === 6); // If less than 6, no more data
	// 			} else {
	// 				// If no events are returned, handle gracefully
	// 				if (page === 1) {
	// 					setEvents([]); // Clear events when starting from page 1
	// 				}
	// 				setHasMoreEvents(false); // No more events to load
	// 			}
	// 			setNoResults(false); // Reset no results state when data is received
	// 		} else {
	// 			// Handle unexpected data format or if the data is not an array
	// 			console.error("Unexpected data format:", response.data);
	// 			if (page === 1) {
	// 				setEvents([]); // Clear events if unexpected format
	// 			}
	// 			setNoResults(true);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error fetching events:", error);
	// 		setNoResults(true); // Set noResults to true if there's an error
	// 	}
	// }

	// async function getEvents(page = 1) {
	// 	try {
	// 		const response = await axios.get(`/api/events?page=${page}&limit=6`);
	// 		if (Array.isArray(response.data.data)) {
	// 			if (page === 1) {
	// 				setEvents(response.data.data);
	// 			} else {
	// 				setEvents((prevEvents) => [...prevEvents, ...response.data.data]);
	// 			}
	// 			setHasMoreEvents(response.data.data.length === 6); // If less than 6, no more data
	// 			setNoResults(false);
	// 		} else {
	// 			console.error("Unexpected data format:", response.data);
	// 			setNoResults(true);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error fetching events:", error);
	// 		setNoResults(true);
	// 	}
	// }

	async function getAllEvents() {
		try {
			const response = await axios.get(`/api/events`);
			if (Array.isArray(response.data.data)) {
				setEvents(response.data.data);
				setNoResults(false);
			} else {
				console.error("Unexpected data format:", response.data);
				setNoResults(true);
			}
		} catch (error) {
			console.error("Error fetching events:", error);
		}
	}

	// Fetch more events when "Load More" is clicked
	const loadMoreEvents = () => {
		const nextPage = currentEventPage + 1;
		getEvents(nextPage);
		setCurrentEventPage(nextPage);
	};

	// Function to fetch reviews with pagination
	async function getReviews(page = 1) {
		try {
			const response = await axios.get(`/api/reviews?page=${page}&limit=3`);
			if (Array.isArray(response.data.data)) {
				if (page === 1) {
					setReviews(response.data.data);
				} else {
					setReviews((prevReviews) => [...prevReviews, ...response.data.data]);
				}
				setHasMoreReviews(response.data.data.length === 3); // If less than 3, no more data
			} else {
				console.error("Unexpected data format:", response.data);
			}
		} catch (error) {
			console.error("Error fetching reviews", error);
			setHasMoreReviews(false);
		}
	}

	// Fetch more reviews when "Load More" is clicked
	const loadMoreReviews = () => {
		const nextPage = currentReviewPage + 1;
		getReviews(nextPage);
		setCurrentReviewPage(nextPage);
	};

	useEffect(() => {
		getEvents(); // Fetch all events initially
		getReviews();
	}, []); // Only runs on mount

	useEffect(() => {
		return () => {
			fetchEvents.cancel(); // Cancel any pending fetchEvents on unmount
		};
	}, []); // Runs on unmount

	function toRegister() {
		router.push({ pathname: "/auth/register" });
	}
	function toLoginUser() {
		router.push({ pathname: "/auth/loginuser" });
	}
	function toPoints() {
		router.push({ pathname: "/points" });
	}

	useEffect(() => {
		Aos.init({ duration: 500 });
		getEvents();
		getReviews();
	}, []);

	return (
		<div>
			<Head>
				<title>Art Expo</title>
			</Head>
			<WavyBackground>
				<div className="relative text-white text-center">
					<div className="w-full h-screen col-span-5 row-span-3 bg-cover bg-center bg-no-repeat shadow-md text-white">
						{/* Navbar - Sticky and Positioned to the Right */}
						<div className="w-full top-0 z-50 p-5">
							<div className="flex items-center justify-end md:px-10">
								{/* Logo di kiri */}

								{/* Tombol di kanan */}
								<div className="flex space-x-8 p">
									<button
										onClick={toRegister}
										className="text-md text-yellow-400 hover:text-yellow-600 transition duration-300 font-extrabold"
									>
										Register
									</button>
									<button
										onClick={toLoginUser}
										className="text-md text-yellow-400 hover:text-yellow-600 transition duration-300 font-extrabold"
									>
										Login
									</button>
									<button className="text-md text-yellow-400 hover:text-yellow-600 transition duration-300 font-extrabold">
										<a href="#review">Review</a>
									</button>
								</div>
							</div>
						</div>

						{/* Hero Section */}
						<div className="h-screen text-white">
							<div className="grid grid-cols-1 sm:grid-cols-2 sm:items-center sm:py-20 sm:px-5 md:grid-cols-2 py-20 md:items-center md:py-52 md:px-5">
								{/* Left Column (Text) */}
								<div className="flex justify-center md:justify-start">
									<Image src="/logo.png" alt="logo" width={300} height={200} />
								</div>
								<div className="text-center md:text-left flex flex-col justify-center space-y-5 px-5">
									<h1
										className="text-3xl sm:text-4xl font-extrabold text-yellow-400"
										data-aos="fade-up"
									>
										Finest collection of inspiration
									</h1>
									<p
										className="text-xl text-white"
										data-aos="fade-up"
										data-aos-delay="300"
									>
										Immerse yourself in the world of creativity, where every
										brushstroke tells a unique story.
									</p>
									<div className="mt-8 gap-5 ">
										<button
											className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition duration-300 mr-4 my-5"
											data-aos="fade-up"
											data-aos-delay="600"
										>
											<a href="#eventList">Explore Events</a>
										</button>
										<button
											className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition duration-300 mr-4"
											data-aos="fade-up"
											data-aos-delay="600"
											onClick={() => toPoints()}
										>
											<p>How Points Works</p>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</WavyBackground>

			{/* Events List */}
			<div className="col-span-5 bg-white p-5 shadow-md text-xl">
				<h2 className="text-3xl font-bold mb-5 text-left text-black">
					Upcoming Events
				</h2>
				<Carousel />
				<h2
					className="text-3xl font-bold my-5 text-left text-black"
					id="eventList"
				>
					Events List
				</h2>
				<form className="max-w-full my-0 grid grid-cols-4 gap-2">
					{/* Search Input */}
					<div className="col-span-3">
						<label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
							Search
						</label>
						<div className="relative my-10">
							<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
								<svg
									className="w-4 h-4 text-gray-500 dark:text-gray-400"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 20 20"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
									/>
								</svg>
							</div>
							<input
								type="search"
								value={searchTerm}
								onChange={handleSearchChange}
								className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Search Events List"
							/>
						</div>
					</div>

					{/* Filter by Category */}
					<div className="col-span-1">
						<div className="relative my-11">
							<select
								value={selectedEventType}
								onChange={handleCategoryChange}
								className="text-black block w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-black"
							>
								<option value="">ALL-Category</option>
								<option value="Exhibition">Exhibition</option>
								<option value="Theater">Theater</option>
								<option value="Festival">Festival</option>
								<option value="Performing">Performing</option>
								<option value="Completed">Completed</option>
							</select>
						</div>
					</div>
				</form>
				{/* Event Results */}
				<div className="max-w-full mx-auto py-10">
					{noResults ? (
						<p className="text-center text-red-500">No events found</p>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-black">
							{events.map((event, index) => (
								<div
									key={index}
									data-aos="fade-up"
									className="bg-gray-100 p-4 shadow-md flex flex-col items-center transform hover:scale-125 hover:shadow-xl hover:bg-gray-200 transition-transform duration-300"
								>
									{/* Bagian gambar */}
									<div className="w-full h-56 mb-4">
										<img
											src={event.image}
											alt={event.event_name}
											className="w-full h-full object-cover"
										/>
									</div>

									{/* Bagian teks */}
									<div className="flex-1 text-center">
										<div className={greatVibes.className}>
											<h3 className="text-2xl font-bold text-black mb-4">
												{event.event_name}
											</h3>
										</div>
										<table className="table-auto border-collapse border-gray-400 mx-auto text-left text-black text-sm">
											<tbody>
												<tr className="border-b border-gray-300 text-sm">
													<td className="px-4 py-2 font-semibold">
														Event Type
													</td>
													<td className="px-4 py-2 text-sm ">
														{event.event_type}
													</td>
												</tr>
												<tr className="border-b border-gray-300">
													<td className="px-4 py-2 font-semibold">
														Description
													</td>
													<td className="px-4 py-2">{event.description}</td>
												</tr>
												<tr className="border-b border-gray-300">
													<td className="px-4 py-2 font-semibold">
														Ticket Available
													</td>
													<td className="px-4 py-2">
														{event.ticket_available}
													</td>
												</tr>
												<tr className="border-b border-gray-300">
													<td className="px-4 py-2 font-semibold">Date</td>
													<td className="px-4 py-2">
														{new Date(event.event_date).toLocaleDateString()}
													</td>
												</tr>
												<tr className="border-b border-gray-300">
													<td className="px-4 py-2 font-semibold">Location</td>
													<td className="px-4 py-2">{event.location}</td>
												</tr>
												<tr>
													<td className="px-4 py-2 font-semibold">Price</td>
													<td className="px-4 py-2">
														{event.price === 0
															? "FREE"
															: `Rp. ${event.price.toLocaleString()}`}
													</td>
												</tr>
											</tbody>
										</table>
									</div>

									<button
										onClick={() => toLoginUser()}
										className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition duration-300"
									>
										Login to Book
									</button>
								</div>
							))}
						</div>
					)}
				</div>
				{hasMoreEvents && (
					<div className="flex justify-center mt-8">
						<button
							className="bg-black hover:bg-yellow-500 text-white text-sm py-3 px-6 rounded-full font-semibold transition duration-300 shadow-md hover:shadow-lg"
							onClick={loadMoreEvents}
						>
							Load More
						</button>
					</div>
				)}
			</div>

			{/* Review Section */}
			<div className="col-span-5 bg-gradient-to-b from-gray-500 to-gray-700 p-5 shadow-md text-xl py-16">
				<h2
					className="text-4xl font-bold mb-5 text-left text-yellow-500"
					id="review"
				>
					User Reviews / Event Testimony
				</h2>
				<div className={`space-y-4 text-black ${quickSand.className}`}>
					{reviews.map((review, index) => (
						<div key={index} className="bg-yellow-500 p-4 rounded-lg shadow-lg">
							<p className="text-lg font-semibold">
								Event: {review.event.event_name}
							</p>

							<div className="flex items-center">
								<p className="font-bold mr-2">Rating:</p>
								{/* Render the 5 stars, change color based on rating */}
								<div className="flex space-x-1">
									{[1, 2, 3, 4, 5].map((starIndex) => (
										<svg
											key={starIndex}
											xmlns="http://www.w3.org/2000/svg"
											fill={review.rating >= starIndex ? "yellow" : "gray"}
											viewBox="0 0 24 24"
											width="24"
											height="24"
											className="text-xl"
										>
											<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
										</svg>
									))}
								</div>
							</div>

							<p className="text-yellow-800 font-bold">
								Username: {review.user.username}
							</p>
							<p>Review: {review.review}</p>
						</div>
					))}
				</div>

				{hasMoreReviews && (
					<div className="flex justify-center mt-8">
						<button
							className="bg-black hover:bg-yellow-500 text-white text-sm py-3 px-6 rounded-full font-semibold transition duration-300 shadow-md hover:shadow-lg"
							onClick={loadMoreReviews}
						>
							Load More
						</button>
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="col-span-5 bg-black p-5 text-center text-sm font-light text-gray-400">
				<p>&copy; 2024 ART EXPO. All Rights Reserved.</p>
				<p>Made with love for art enthusiasts around the world.</p>
			</div>
		</div>
	);
}

export default Home;
