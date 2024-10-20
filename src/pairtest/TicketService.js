import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js"

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  #maxTickets = 25;
  #ticketPrices = {
    ADULT: 25,
    CHILD: 15,
    INFANT: 0,
  };

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException("Invalid account ID");
    }

    const {totalAmount, totalSeats } = this.#processTicketRequests(ticketTypeRequests);
  
    this.#processPayment(accountId, totalAmount);
    this.#reserveSeats(accountId, totalSeats);
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
      
      if (ticketType === "INFANT") {
        infantTickets += noOfTickets; // Infants don't need seats
      }else if ( ticketType === "ADULT" || ticketType === "CHILD") {
        totalSeats += noOfTickets;
        (ticketType === "ADULT") ? adultTickets += noOfTickets : childTickets += noOfTickets;
      }
    }

    return {
      totalAmount,
      totalSeats,
    }
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
