import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  #maxTickets = 25;
  #ticketPrices = {
    ADULT: 25,
    CHILD: 15,
    INFANT: 0, // Infants do not pay for tickets
  };

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException("Invalid account ID");
    }

    const { totalAmount, totalSeats } = this.#processTicketRequests(ticketTypeRequests);

    this.#processPayment(accountId, totalAmount); // Makes a payment request 
    this.#reserveSeats(accountId, totalSeats); // Makes a seat reservation request
  }

  #validateTicketCount(totalTickets) { 
    if (totalTickets > this.#maxTickets) {
      throw new InvalidPurchaseException(
        "Cannot purchase more than 25 tickets at a time",
      );
    }

    if(totalTickets <= 0) {
      throw new InvalidPurchaseException("Atleast one ticket must be purchased");
    }
  }

  #validateAdultPresence(adultTickets, childTickets, infantTickets) {
    if ((childTickets > 0 || infantTickets > 0) && adultTickets === 0) {
      throw new InvalidPurchaseException(
        "Child and Infant tickets cannot be purchased without an Adult ticket",
      );
    }
  }

  #processTicketRequests(ticketTypeRequests) {
    let totalTickets = 0;
    let totalAmount = 0;
    let totalSeats = 0;
    let adultTickets = 0;
    let childTickets = 0;
    let infantTickets = 0;

    for (const request of ticketTypeRequests) {
      const ticketType = request.getTicketType();
      const noOfTickets = request.getNoOfTickets();

      totalTickets += noOfTickets;
      totalAmount += noOfTickets * this.#ticketPrices[ticketType];

      // Validate ticket count
      this.#validateTicketCount(totalTickets);

      if (ticketType === "INFANT") {
        infantTickets += noOfTickets; // Infants don't need seats
      } else if (ticketType === "ADULT" || ticketType === "CHILD") {
        totalSeats += noOfTickets;
        (ticketType === "ADULT") ? (adultTickets += noOfTickets) : (childTickets += noOfTickets);
      }
    }

    // Validate adult presence after processing all tickets
    this.#validateAdultPresence(adultTickets, childTickets, infantTickets);

    return {
      totalAmount,
      totalSeats,
    };
  }

  // Private method to process payment
  #processPayment(accountId, totalAmount) {
    const paymentService = new TicketPaymentService();
    paymentService.makePayment(accountId, totalAmount);
  }

  // Private method to reserve seats
  #reserveSeats(accountId, totalSeats) {
    const reservationService = new SeatReservationService();
    reservationService.reserveSeat(accountId, totalSeats);
  }
}
