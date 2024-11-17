import React, { useEffect, useState } from "react";
import { useAuth } from "@/utils/hooks/useAuth";
import axios from "axios";
import { Events, DecodedToken } from "@/models/models";
import debounce from "lodash.debounce";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Carousel from "@/components/carousel";
import { Quicksand } from "next/font/google";
import { Great_Vibes } from "next/font/google";
import { WavyBackground } from "@/components/ui/wavy-background";

const quickSand = Quicksand({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});

const greatVibes = Great_Vibes({
	weight: "400",
	subsets: ["latin"],
});

function Homeuser() {
	useAuth();
	const router = useRouter();
	const [events, setEvents] = useState<Events[]>([]);
	const [noResults, setNoResults] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [selectedEventType, setSelectedEventType] = useState(""); // State for event type
	const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
	const [reviewData, setReviewData] = useState({
		userId: "", // default as number
		paymentId: "", // default as number
		reviewText: "",
		rating: 0,
		eventId: 0,
	});

	const [currentEventPage, setCurrentEventPage] = useState(1);
	const [hasMoreEvents, setHasMoreEvents] = useState(true);
	const [bookedEvents, setBookedEvents] = useState<Booking[]>([]);

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

	// Fetch all booked events for the logged-in user
	const fetchAllBookedEvents = async (userId: number) => {
		try {
			const accessToken = Cookies.get("access_token");
			const response = await axios.get(`/api/user/booked-events/${userId}`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			setBookedEvents(response.data.data);
		} catch (error) {
			if (
				axios.isAxiosError(error) &&
				error.response &&
				error.response.status === 404
			) {
				// Handle 404 response - no booked events found
				setBookedEvents([]); // Set an empty array to avoid errors
			} else {
				console.error("Error fetching booked events:", error);
				Swal.fire("Error!", "Failed to fetch booked events.", "error");
			}
		}
	};
	const handleReviewClick = (bookingId: number) => {
		if (userProfile?.bookings) {
			// Check if userProfile is not null and bookings is available
			const booking = userProfile.bookings.find(
				(b: Booking) => b.booking_id === bookingId
			);

			if (booking && booking.payments.length > 0) {
				setReviewData({
					userId: String(userProfile.user_id), // Safe to access user_id
					paymentId: String(booking.payments[0].payment_id), // Safe to access payment_id
					reviewText: "",
					rating: 0,
					eventId: booking.event.event_id, // Safe to access event_id
				});
				setIsReviewModalOpen(true);
			} else {
				Swal.fire("Error!", "Payment not found for this booking.", "error");
			}
		} else {
			Swal.fire("Error!", "User profile is missing or not loaded.", "error");
		}
	};

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

	// Fetch events initially
	async function getEvents(page = 1) {
		try {
			const response = await axios.get(`/api/events?page=${page}&limit=6`);
			if (Array.isArray(response.data.data)) {
				if (page === 1) {
					setEvents(response.data.data);
				} else {
					setEvents((prevEvents) => [...prevEvents, ...response.data.data]);
				}
				setHasMoreEvents(response.data.data.length === 6); // If less than 6, no more data
				setNoResults(false);
			} else {
				console.error("Unexpected data format:", response.data);
				setNoResults(true);
			}
		} catch (error) {
			setNoResults(true);
		}
	}

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

	//fetch the user data
	useEffect(() => {
		const fetchUserProfile = async () => {
			const accessToken = Cookies.get("access_token");

			if (!accessToken) {
				Swal.fire({
					icon: "warning",
					title: "Please log in first",
					text: "You need to log in to access this page.",
				}).then(() => {
					window.location.href = "/auth/loginuser"; // Redirect to login page if no token
				});
			} else {
				try {
					const decodedToken = jwtDecode<DecodedToken>(accessToken);
					const userId = decodedToken.user;

					const response = await axios.get(`/api/user/${userId}`, {
						headers: { Authorization: `Bearer ${accessToken}` },
					});
					setUserProfile(response.data.data);

					// Fetch all booked events for the user
					await fetchAllBookedEvents(userId);
				} catch (error) {
					Swal.fire({
						icon: "error",
						title: "Failed to load user data",
						text: "Unable to retrieve user information. please login",
						confirmButtonText: "OK",
					});
					router.push("/auth/loginuser"); // Redirect to login page if error fetching user data
				}
			}
		};
		fetchUserProfile();
	}, []);

	const handleLogout = () => {
		// Delete the access token cookie
		Cookies.remove("access_token");

		Swal.fire({
			icon: "success",
			title: "Logged Out",
			text: "You have been logged out successfully.",
			confirmButtonText: "OK",
		}).then(() => {
			// Redirect to login page after the alert is closed
			router.push("/");
		});
	};

	useEffect(() => {
		getEvents(); // Fetch all events initially
	}, []); // Only runs on mount

	useEffect(() => {
		return () => {
			fetchEvents.cancel(); // Cancel any pending fetchEvents on unmount
		};
	}, []); // Runs on unmount

	//function for booking
	async function handleBookEventWithoutPoints(event_id: number) {
		const accessToken = Cookies.get("access_token");

		if (!accessToken) {
			Swal.fire("Error!", "Access token is missing.", "error");
			return;
		}

		// Check the event type before booking
		const eventToBook = events.find((event) => event.event_id === event_id);
		if (eventToBook?.event_type === "Completed") {
			Swal.fire({
				icon: "warning",
				title: "Booking Restricted",
				text: "You cannot book an event that is marked as Completed.",
			});
			return;
		}

		// Check if the user has already booked this event
		const alreadyBooked = userProfile?.bookings.some(
			(booking: Booking) => booking.event.event_id === event_id
		);

		if (alreadyBooked) {
			// If already booked, show a notice
			Swal.fire({
				title: "You've booked this event before!",
				text: "An Event cannot be booked twice",
				icon: "warning",
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Okay I am understand!",
			});
		} else {
			// Show confirmation dialog for new booking
			Swal.fire({
				title: "Are You Sure you want to book this event without points ?",
				text: "Do you want to book this event?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Yes, Book It!",
				cancelButtonText: "No, Cancel",
			}).then(async (result) => {
				// Proceed if the result is confirmed
				if (result.isConfirmed) {
					try {
						const decodedToken = jwtDecode<DecodedToken>(accessToken);
						const userId = decodedToken.user;
						const eventId = event_id;
						const response = await axios.post(
							"/api/user/book-eventWihoutPoints",
							{ userId, eventId }, // Include userId and eventId in the request body
							{
								headers: {
									Authorization: `Bearer ${accessToken}`, // Include the access token in the headers
								},
							}
						);
						if (response.status === 201) {
							Swal.fire("Success!", "Event booked successfully!", "success");
							setTimeout(() => {
								window.location.reload(); // Reload after 2 seconds
							}, 2000);
						} else {
							Swal.fire(
								"Error!",
								"Failed to book the event. Please try again.",
								"error"
							);
						}
					} catch (error) {
						const err = error as Error;
						Swal.fire(
							"Error!",
							err.message || "An error occurred while booking the event.",
							"error"
						);
					}
				}
			});
		}
	}

	async function handleBookEvent(event_id: number) {
		const accessToken = Cookies.get("access_token");

		if (!accessToken) {
			Swal.fire("Error!", "Access token is missing.", "error");
			return;
		}

		// Check the event type before booking
		const eventToBook = events.find((event) => event.event_id === event_id);
		if (eventToBook?.event_type === "Completed") {
			Swal.fire({
				icon: "warning",
				title: "Booking Restricted",
				text: "You cannot book an event that is marked as Completed.",
			});
			return;
		}

		// Check if the user has already booked this event
		const alreadyBooked = userProfile?.bookings.some(
			(booking: Booking) => booking.event.event_id === event_id
		);

		if (alreadyBooked) {
			// If already booked, show a notice
			Swal.fire({
				title: "You've booked this event before!",
				text: "An Event cannot be booked twice",
				icon: "warning",
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Okay I am understand!",
			});
		} else {
			// Show confirmation dialog for new booking
			Swal.fire({
				title: "Are You Sure?",
				text: "Do you want to book this event?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Yes, Book It!",
				cancelButtonText: "No, Cancel",
			}).then(async (result) => {
				// Proceed if the result is confirmed
				if (result.isConfirmed) {
					try {
						const decodedToken = jwtDecode<DecodedToken>(accessToken);
						const userId = decodedToken.user;
						const eventId = event_id;
						const response = await axios.post(
							"/api/user/book-event",
							{ userId, eventId }, // Include userId and eventId in the request body
							{
								headers: {
									Authorization: `Bearer ${accessToken}`, // Include the access token in the headers
								},
							}
						);
						if (response.status === 201) {
							Swal.fire("Success!", "Event booked successfully!", "success");
							setTimeout(() => {
								window.location.reload(); // Reload after 2 seconds
							}, 2000);
						} else {
							Swal.fire(
								"Error!",
								"Failed to book the event. Please try again.",
								"error"
							);
						}
					} catch (error) {
						const err = error as Error;
						Swal.fire(
							"Error!",
							err.message || "An error occurred while booking the event.",
							"error"
						);
					}
				}
			});
		}
	}

	async function deleteBookedEvent(booking_id: number) {
		const accessToken = Cookies.get("access_token");

		if (!accessToken) {
			Swal.fire("Error!", "Access token is missing.", "error");
			return;
		}

		// Show confirmation dialog
		const result = await Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete this booking?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel!",
		});

		// Proceed with deletion only if the user confirms
		if (result.isConfirmed) {
			try {
				// Make the DELETE request to the API with booking_id
				const response = await axios.delete(
					`/api/user/book-event/${booking_id}`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`, // Include the access token in the headers
						},
					}
				);

				// Check the response status
				if (response.status === 200) {
					Swal.fire("Success!", "Booking deleted successfully!", "success");
					window.location.reload(); // Reload the page or fetch the booked events again
				} else {
					Swal.fire(
						"Error!",
						"Failed to delete the booking. Please try again.",
						"error"
					);
				}
			} catch (error) {
				const err = error as Error;
				console.error("Error deleting booking:", error);
				Swal.fire(
					"Error!",
					err.message || "An error occurred while deleting the booking.",
					"error"
				);
			}
		} else {
			// If the user cancels the operation
			Swal.fire("Cancelled", "Your booking is safe :)", "error");
		}
	}

	async function purchaseEvent(userId: number, bookingId: number) {
		const accessToken = Cookies.get("access_token");

		if (!accessToken) {
			Swal.fire("Error!", "Access token is missing.", "error");
			return;
		}
		// Show confirmation dialog
		const result = await Swal.fire({
			title: "Do you want to purchase this event ?",
			text: "Any purchased/paid event cannot be cancelled",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, Purchase it!",
			cancelButtonText: "Let me look other event first",
		});

		if (result.isConfirmed) {
			try {
				const decodedToken = jwtDecode<DecodedToken>(accessToken);
				const userId = decodedToken.user; // Assuming this is the user ID

				const response = await axios.post(
					`/api/user/purchase-event`,
					{ userId, bookingId },
					{
						headers: {
							Authorization: `Bearer ${accessToken}`, // Include the access token in the headers
						},
					}
				);

				if (response.status === 201) {
					const paymentId = response.data.data.payment.payment_id;
					Swal.fire("Success!", "Event Purchased successfully!", "success");
					setTimeout(() => {
						window.location.reload(); // Reload after 2 seconds
					}, 2000);
					router.push(`/homeuser/payment/${paymentId}`);
				} else {
					Swal.fire(
						"Error!",
						"Failed to book the event. Please try again.",
						"error"
					);
				}
			} catch (error) {
				const err = error as Error;
				Swal.fire(
					"Error!",
					err.message || "An error occurred while paying the event.",
					"error"
				);
			}
		}
	}
	const seeTicket = async (paymentId: number) => {
		const accessToken = Cookies.get("access_token");
		if (!accessToken) {
			Swal.fire({
				icon: "warning",
				title: "Access Denied",
				text: "Please log in to view payment details.",
			}).then(() => {
				router.push("/loginuser");
			});
			return;
		}

		try {
			// Assuming the paymentId is valid and user is authorized
			router.push(`/homeuser/payment/${paymentId}`);
		} catch (error) {
			console.error("Error fetching payment details:", error);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Failed to navigate to the payment page.",
			});
		}
	};

	const handleSubmitReview = async () => {
		const accessToken = Cookies.get("access_token");
		if (!accessToken) {
			Swal.fire("Error!", "Access token is missing.", "error");
			return;
		}

		// Ensure that required fields are populated
		if (
			!reviewData.userId ||
			!reviewData.paymentId ||
			!reviewData.reviewText ||
			!reviewData.rating ||
			!reviewData.eventId
		) {
			Swal.fire("Error!", "All review fields must be filled.", "error");
			return;
		}

		// Convert userId and paymentId to numbers and validate
		const userId = parseInt(reviewData.userId);
		console.log(typeof userId);
		const paymentId = parseInt(reviewData.paymentId);
		console.log(typeof paymentId);

		try {
			console.log({
				userId,
				paymentId,
				reviewText: reviewData.reviewText,
				rating: reviewData.rating,
				eventId: reviewData.eventId,
			});
			await axios.post(
				"http://localhost:8000/api/user/review",
				{
					userId, // Convert back to number
					paymentId, // Convert back to number
					reviewText: reviewData.reviewText,
					rating: reviewData.rating,
					eventId: reviewData.eventId,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json", // Ensure correct content type
					},
				}
			);

			Swal.fire("Success!", "Your review has been submitted.", "success");
			setIsReviewModalOpen(false);
			setReviewData({
				userId: "",
				paymentId: "",
				reviewText: "",
				rating: 0,
				eventId: 0,
			});
		} catch (error) {
			const err = error as Error;
			Swal.fire(
				"Error! You have written a review before",
				err.message || "Failed to submit review.",
				"error"
			);
		}
	};
	function SheetDemo() {
		return (
			<Sheet>
				<SheetTrigger asChild>
					<Button
						className="text-md bg-yellow-500 hover:bg-yellow-600 transition duration-300 font-extrabold"
						data-aos="fade-up"
						data-aos-delay="600"
					>
						<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAwYy01LjA4MyAwLTguNDY1IDQuOTQ5LTMuNzMzIDEzLjY3OCAxLjU5NiAyLjk0NS0xLjcyNSAzLjY0MS01LjA5IDQuNDE4LTMuMDczLjcwOS0zLjE4NyAyLjIzNS0zLjE3NyA0LjkwNGwuMDA0IDFoMjMuOTlsLjAwNC0uOTY5Yy4wMTItMi42ODgtLjA5My00LjIyMy0zLjE3Ny00LjkzNS0zLjQzOC0uNzk0LTYuNjM5LTEuNDktNS4wOS00LjQxOCA0LjcxOS04LjkxMiAxLjI1MS0xMy42NzgtMy43MzEtMTMuNjc4bTAgMWMxLjg5IDAgMy4zOS43NjQgNC4yMjUgMi4xNSAxLjM1NCAyLjI1MS44NjYgNS44MjQtMS4zNzcgMTAuMDYtLjU3NyAxLjA5Mi0uNjczIDIuMDc4LS4yODMgMi45MzIuOTM3IDIuMDQ5IDQuNzU4IDIuNjMyIDYuMDMyIDIuOTI4IDIuMzAzLjUzNCAyLjQxMiAxLjMxMyAyLjQwMSAzLjkzaC0yMS45OThjLS4wMS0yLjYxNS4wOS0zLjM5NiAyLjQwMS0zLjkzIDEuMTU3LS4yNjYgNS4xMzgtLjkxOSA2LjA0OS0yLjk0LjM4Ny0uODU4LjI4NC0xLjg0My0uMzA0LTIuOTI5LTIuMjMxLTQuMTE1LTIuNzQ0LTcuNzY0LTEuNDA1LTEwLjAxMi44NC0xLjQxMiAyLjM1My0yLjE4OSA0LjI1OS0yLjE4OSIvPjwvc3ZnPg=="></img>
						<p className="text-black">{userProfile?.username} </p>
					</Button>
				</SheetTrigger>
				<SheetContent className="bg-gradient-to-b from-gray-900 to-gray-600 text-white">
					<SheetHeader>
						<SheetTitle
							className={`flex justify-center items-center text-yellow-500 text-3xl ${greatVibes.className}`}
						>
							Profile
						</SheetTitle>
						<SheetDescription>Hello, {userProfile?.username}</SheetDescription>
					</SheetHeader>
					<div className={`grid gap-4 py-4 ${quickSand.className}`}>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Name:
							</Label>
							<p>{userProfile?.username}</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">
								Email:
							</Label>
							<p>{userProfile?.email}</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="point" className="text-right">
								Point:
							</Label>
							<p> {userProfile?.points}</p>
						</div>
					</div>
					<div className="flex justify-center items-center py-5">
						Invite People with Your Referal Code ! :{" "}
					</div>
					<div className="flex justify-center items-center py-10 text-3xl text-bold text-yellow-500">
						{userProfile?.referralCodes[0]?.referral_code}
					</div>

					<SheetFooter className="">
						<SheetClose asChild>
							<Button onClick={handleLogout} className="bg-red-700">
								Logout
							</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<div>
			{userProfile ? (
				<div className="bg-black">
					<div className="relative text-white text-center">
						<div className="w-full h-screen col-span-5 row-span-3 bg-cover bg-center bg-no-repeat shadow-md text-white">
							{/* Navbar - Sticky and Positioned to the Right */}
							<div className="w-full sticky top-0 z-10 py-4">
								<div className="flex items-center justify-between px-0 md:px-10">
									{/* Logo di kiri */}
									<div className="flex items-center">
										<Image
											src="/logo.png"
											alt="logo"
											width={160}
											height={100}
										/>
									</div>

									{/* Tombol di kanan */}
									<div className="flex space-x-8">
										<button
											//onClick={toRegister}
											className="text-md text-yellow-400 hover:text-yellow-600 transition duration-300 font-extrabold"
										>
											<a href="#myEvents">My Events</a>
										</button>

										<button>
											<SheetDemo />
										</button>
									</div>
								</div>
							</div>

							{/* Hero Section */}
							<WavyBackground>
								<div className="h-screen text-white">
									<div className="grid grid-cols-1 sm:grid-cols-2 sm:items-center sm:py-20 sm:px-5 md:grid-cols-2 py-20 md:items-center md:py-52 md:px-5">
										{/* Left Column (Text) */}
										<div
											className={`text-center md:text-left flex flex-col justify-center space-y-5 px-5 py-15 `}
										>
											<h1
												className="text-3xl sm:text-4xl font-extrabold text-yellow-400"
												data-aos="fade-up"
											>
												Finest collection of inspiration
											</h1>
											<p
												className="text-lg text-white"
												data-aos="fade-up"
												data-aos-delay="300"
											>
												Immerse yourself in the world of creativity, where every
												brushstroke tells a unique story.
											</p>
											<div className="mt-8">
												<button
													className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition duration-300 mr-4"
													data-aos="fade-up"
													data-aos-delay="600"
												>
													<a href="#eventList">Explore Now</a>
												</button>
												<button></button>
											</div>
										</div>
									</div>
								</div>
							</WavyBackground>
						</div>
					</div>

					{/* Events List */}
					<div className="col-span-5 bg-white p-5 shadow-md text-xl py-16">
						<h2 className={"text-3xl font-bold mb-5 text-left text-black"}>
							Upcoming Events
						</h2>
						<Carousel />

						<h2
							className="text-3xl font-bold my-5 text-left text-black"
							id="eventList"
						>
							Events List
						</h2>
						{/* Search */}

						<form className="max-w-full mx-auto grid grid-cols-4 gap-2">
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
										<option value="">All Event Types</option>
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
											className="bg-gray-100 p-4 shadow-md flex flex-col items-center"
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
												<table className="max-w-full table-auto border-collapse border-gray-400 mx-auto text-left text-black text-sm">
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
																{new Date(
																	event.event_date
																).toLocaleDateString()}
															</td>
														</tr>
														<tr className="border-b border-gray-300">
															<td className="px-4 py-2 font-semibold">
																Location
															</td>
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
											<div className="flex gap-5 my-5">
												{/* Get Ticket Button */}
												<button
													className="bg-red-500 hover:bg-red-700 text-black text-sm font-bold py-2 px-4 rounded-lg transition duration-300 "
													onClick={() => handleBookEvent(event.event_id)} // Pass event ID to the handler
												>
													Get Ticket with My point
												</button>

												{/* Get Ticket with Points Button */}
												<button
													className="bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-bold py-2 px-4 rounded-lg transition duration-300"
													onClick={() =>
														handleBookEventWithoutPoints(event.event_id)
													} // Pass event ID to the handler
												>
													Get Ticket without point
												</button>
											</div>
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

					{/* BOOKED LIST */}
					<div className="bg-gradient-to-b from-gray-900 to-gray-600">
						<div className={`flex justify-center items-center text-black`}>
							<h2
								id="myEvents"
								className="mt-8 text-4xl font-semibold text-left py-10 text-yellow-500"
							>
								My Booked List Session
							</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mt-4 mx- py-10 p-5">
							{bookedEvents.length > 0 ? (
								bookedEvents.map((booking: Booking) => {
									const bookedEvent = booking.event; // Directly use event data from the booking
									const isPaymentCompleted = booking.status === "completed";

									return (
										<div
											key={booking.booking_id}
											className={`border border-black-300 bg-yellow-500 rounded-lg p-4 shadow-lg flex items-center justify-between text-black ${quickSand.className}`}
										>
											{/* Event Image */}
											{bookedEvent && bookedEvent.image ? (
												<img
													src={bookedEvent.image}
													alt={bookedEvent.event_name}
													className="w-24 h-24 object-cover rounded-t-lg"
												/>
											) : (
												<img
													src="/path/to/fallback-image.jpg" // Fallback image
													alt="Fallback Image"
													className="w-24 h-24 object-cover rounded-t-lg"
												/>
											)}
											<div className="flex-grow ml-4">
												<h3 className="font-semibold text-lg text-black mt-2">
													{bookedEvent
														? bookedEvent.event_name
														: "Event Not Found"}
												</h3>
												<p className="text-black">
													Date:{" "}
													{bookedEvent
														? new Date(
																bookedEvent.event_date
														  ).toLocaleDateString()
														: "N/A"}
												</p>
												<p className="text-black">
													Location: {bookedEvent ? bookedEvent.location : "N/A"}
												</p>
												<p className="text-black">Status: {booking.status}</p>
												<p className="text-black">
													Price: Rp.{" "}
													{bookedEvent
														? bookedEvent.price.toLocaleString()
														: "N/A"}
												</p>
												<p className="text-black">
													Final Discounted Price: Rp.{" "}
													{bookedEvent
														? bookedEvent.discounted_price.toLocaleString()
														: "N/A"}
												</p>
											</div>
											<div>
												{isPaymentCompleted ? (
													<>
														<button
															onClick={() => {
																if (
																	booking.payments &&
																	booking.payments.length > 0
																) {
																	const paymentId =
																		booking.payments[0]?.payment_id;
																	if (paymentId) {
																		seeTicket(paymentId);
																	} else {
																		Swal.fire(
																			"Error!",
																			"Payment ID not found.",
																			"error"
																		);
																	}
																} else {
																	Swal.fire(
																		"Error!",
																		"No valid payments found.",
																		"error"
																	);
																}
															}}
															className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
														>
															See my tickets
														</button>
														{bookedEvent?.event_type === "Completed" && (
															<button
																onClick={() =>
																	handleReviewClick(booking.booking_id)
																}
																className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 mt-2"
															>
																Write a Review
															</button>
														)}
													</>
												) : (
													<>
														<button
															onClick={() =>
																purchaseEvent(
																	userProfile.user_id,
																	booking.booking_id
																)
															}
															className="bg-green-500 text-black py-2 px-4 rounded-lg hover:bg-green-700 mr-4"
														>
															Proceed to Pay
														</button>
														<button
															onClick={() =>
																deleteBookedEvent(booking.booking_id)
															}
															className="bg-red-600 text-white border border-black py-2 px-4 rounded-lg hover:bg-black"
														>
															Delete My Booking
														</button>
													</>
												)}
											</div>
										</div>
									);
								})
							) : (
								<p className="text-center text-red-700 text-2xl ">
									No booked events found.
								</p>
							)}
						</div>
					</div>

					{/* Footer */}
					<div className="col-span-5 bg-black p-5 text-center text-sm font-light text-gray-400 mt-10">
						<p>&copy; 2024 ART EXPO. All Rights Reserved.</p>
						<p>Made with love for art enthusiasts around the world.</p>
					</div>
				</div>
			) : (
				<div className="w-screen h-screen bg-gradient-to-b from-gray-900 to-gray-600 flex flex-col justify-center items-center text-center">
					<Image src="/loading.gif" alt="logo" width={240} height={150} />
					<h1 className={`text-yellow-500 text-2xl ${quickSand.className}`}>
						Loading...
					</h1>
				</div>
			)}

			{isReviewModalOpen && (
				<div className="modal fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
					<div className="bg-white p-4 rounded shadow-lg w-1/3">
						<h2 className="text-2xl mb-4">Write a Review</h2>
						<textarea
							name="reviewText"
							value={reviewData.reviewText}
							onChange={(e) =>
								setReviewData({ ...reviewData, reviewText: e.target.value })
							}
							placeholder="Write your review here..."
							className="w-full p-2 border rounded mb-4"
						/>
						<label className="block mb-2">Rating (1-5):</label>
						<select
							name="rating"
							value={reviewData.rating}
							onChange={(e) =>
								setReviewData({ ...reviewData, rating: Number(e.target.value) })
							}
							className="w-full p-2 border rounded mb-4"
						>
							<option value="0">Select Rating</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</select>
						<button
							onClick={handleSubmitReview}
							className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
						>
							Submit Review
						</button>
						<button
							onClick={() => setIsReviewModalOpen(false)}
							className="ml-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Homeuser;
