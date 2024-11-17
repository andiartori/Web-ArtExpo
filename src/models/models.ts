export interface Events {
	image: string;
	event_name: string;
	location: string;
	description: string;
	event_date: string;
	event_type: string;
	ticket_available: number;
	price: number;
	event_id: number;
	discounted_price: number;
}

export interface EventsCreate {
	image?: File | string; // Updated to allow File
	event_id?: number;
	event_name: string;
	location: string;
	description: string;
	event_date: string;
	event_type: string;
	ticket_available: number;
	price: number;
}

export interface EventsDelete {
	image?: File | string; // Updated to allow File
	event_id: number;
	event_name: string;
	location: string;
	description: string;
	event_date: string;
	event_type: string;
	ticket_available: number;
	price: number;
}
// Define Event interface
export interface Event {
	event_name: string;
	// Add any additional properties for the event object
	event_id?: number; // Example of another possible property
}

// Define User interface
export interface User {
	username: string;
	// Add any additional properties for the user object
	user_id?: number; // Example of another possible property
}

// Define Reviews interface using Event and User interfaces
export interface Reviews {
	event_name: string;
	username: string;
	review: string;
	rating: number;
	event: Event;
	user: User;
}

export interface DecodedToken {
	user: number;
	role: string;
	iat?: number;
	exp?: number;
}

export interface Booking {
	booking_id: number;
	quantity: number;
	booking_date: string;
	status: string;
	amount: number;
	event: {
		event_id: number;
		event_name: string;
		location: string;
		event_date: string;
		event_type: string;
		price: number;
		discounted_price: number;
		image: string;
	};
	payments?: {
		payment_id: number;
		total_amount: number;
		payment_date: string;
		payment_status: string;
	}[]; // Update to reflect an array of payments
}

export interface PaymentDetails {
	bookingId: number;
	total_amount: number;
	payment_date: string;
	payment_status: string;
	booking: {
		booking_id: number;
		quantity: number;
		booking_date: string;
		status: string;
		amount: number;
		event: {
			event_id: number;
			event_name: string;
			location: string;
			event_date: string;
			event_type: string;
			price: number;
			discounted_price: number;
		};
	};
}

