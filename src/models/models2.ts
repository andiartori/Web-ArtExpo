interface ReferralCode {
	referral_id: number;
	userId: number;
	referral_code: string;
	referral_points: number;
	count_used: number;
	created_at: string; // ISO 8601 date format
}

interface Payment {
	payment_id: number;
}

interface Event {
	event_id: number;
	event_name: string;
	location: string;
	description?: string;
	image?: string;
	event_date: string; // ISO 8601 date format
	event_type: string;
	price: number;
	discounted_price: number;
}

export interface Booking {
	booking_id: number;
	userId: number;
	eventId: number;
	quantity: number;
	booking_date: string; // ISO 8601 date format
	status: string;
	amount: number;
	payments: Payment[];
	event: Event;
}

export interface UserProfile {
	user_id: number; // Changed to string for compatibility with reviewData
	userId: string;
	username: string;
	email: string;
	points: number;
	role: string;
	referralCodes: ReferralCode[];
	bookings: Booking[];
}

// Review data interface (new type)
// interface ReviewData {
// 	userId: number;
// 	paymentId: number;
// 	reviewText: string;
// 	rating: number;
// 	eventId: number;
// }
