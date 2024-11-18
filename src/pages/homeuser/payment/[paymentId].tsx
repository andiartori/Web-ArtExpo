import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Image from "next/image";
import Head from "next/head";

interface PaymentDetails {
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

const PaymentDetailPage: React.FC = () => {
	const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const { paymentId } = router.query;

	useEffect(() => {
		if (!paymentId) return;

		const fetchPaymentDetails = async () => {
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
				const response = await axios.get(`/api/user/payment/${paymentId}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				setPaymentDetails(response.data.data);
				setLoading(false);
			} catch (error) {
				const err = error as Error;
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Failed to retrieve payment details." + err.message,
				});
				setLoading(false);
			}
		};

		fetchPaymentDetails();
	}, [paymentId, router]);

	if (loading) {
		return <div className="text-center text-white mt-10">Loading...</div>;
	}

	if (!paymentDetails) {
		return (
			<div className="text-center text-red-500 mt-10">
				Payment details not found.
			</div>
		);
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
		}).format(amount);
	};
	function toHomeUser() {
		router.push("/homeuser");
	}

	return (
		<div>
			<Head>
				<title>Art Expo</title>
			</Head>
			<section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
				<form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
					<div className="mx-auto max-w-3xl">
						<Image src="/logoshadow.png" alt="logo" width={200} height={120} />
						<h2 className="text-xl text-center font-semibold text-gray-900 dark:text-white sm:text-2xl">
							Order summary
						</h2>
						<div className="mt-6 space-y-4 border-b border-t border-gray-200 py-8 dark:border-gray-700 sm:mt-8">
							<h4 className="text-lg font-semibold text-gray-900 dark:text-white">
								Billing & Delivery information Payment Id : {paymentId}
							</h4>
							<h4 className="text-lg font-semibold text-gray-900 dark:text-white">
								Booking Id Listed : {paymentDetails?.bookingId}
							</h4>

							<dl>
								<dt className="text-base font-medium text-gray-900 dark:text-white">
									Individual Ticket
								</dt>
								<dd className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
									location Event : {paymentDetails?.booking?.event?.location}
								</dd>
							</dl>
						</div>

						<div className="mt-6 sm:mt-8">
							<div className="relative overflow-x-auto border-b border-gray-200 dark:border-gray-800">
								<table className="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
									<tbody className="divide-y divide-gray-200 dark:divide-gray-800">
										<tr>
											<td className="whitespace-nowrap py-4 md:w-[384px]">
												<div className="flex items-center gap-4">
													<a
														href="#"
														className="flex items-center aspect-square w-10 h-10 shrink-0"
													></a>
													<a href="#" className="hover:underline">
														{paymentDetails?.booking?.event.event_name}
													</a>
												</div>
											</td>

											<td className="p-4 text-base font-normal text-gray-900 dark:text-white">
												x1
											</td>

											<td className="p-4 text-right text-base font-bold text-gray-900 dark:text-white">
												{formatCurrency(paymentDetails.booking.event.price)}
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							<div className="mt-4 space-y-6">
								<h4 className="text-xl font-semibold text-gray-900 dark:text-white">
									Order summary
								</h4>

								<div className="space-y-4">
									<div className="space-y-2">
										<dl className="flex items-center justify-between gap-4">
											<dt className="text-gray-500 dark:text-gray-400">
												Event Price
											</dt>
											<dd className="text-base font-medium text-gray-900 dark:text-white">
												{formatCurrency(paymentDetails.booking.event.price)}
											</dd>
										</dl>

										<dl className="flex items-center justify-between gap-4">
											<dt className="text-gray-500 dark:text-gray-400">
												Discount (point used x 1000)
											</dt>
											<dd className="text-base font-medium text-green-500">
												{formatCurrency(
													paymentDetails.booking.event.price -
														paymentDetails.booking.amount
												)}
											</dd>
										</dl>
									</div>

									<dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
										<dt className="text-lg font-bold text-gray-900 dark:text-white">
											Price After Discount
										</dt>
										<dd className="text-lg font-bold text-gray-900 dark:text-white">
											{formatCurrency(paymentDetails.booking.amount)}
										</dd>
									</dl>
								</div>

								<div className="flex items-start sm:items-center">
									<label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
										{" "}
										Please ScreenShot this proof of payment for further process.
										see you at the event!
									</label>
								</div>

								<div className="gap-4 sm:flex sm:items-center">
									<button
										type="button"
										onClick={toHomeUser}
										className="w-full rounded-lg  border border-gray-200 bg-white px-5  py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
									>
										Return to User Page
									</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</section>
		</div>
	);
};

export default PaymentDetailPage;
