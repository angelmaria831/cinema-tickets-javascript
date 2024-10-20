import TicketService from "../src/pairtest/TicketService";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService";

jest.mock("../src/thirdparty/paymentgateway/TicketPaymentService.js");
jest.mock("../src/thirdparty/seatbooking/SeatReservationService.js");

describe("TicketService", () => {
  let ticketService;
  const accountId = 1;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  it("should throw error for invalid accountId", () => {
    const ticketRequest = new TicketTypeRequest("ADULT", 2);

    expect(() => {
      ticketService.purchaseTickets(0, ticketRequest);
    }).toThrow(InvalidPurchaseException);

    expect(() => {
      ticketService.purchaseTickets(3.5, ticketRequest);
    }).toThrow(InvalidPurchaseException);

    expect(() => {
      ticketService.purchaseTickets(-6, ticketRequest);
    }).toThrow(InvalidPurchaseException);
  });

  it("should successfully compute the totalAmount and totalSeats for valid requests", () => {
    const requests = new TicketTypeRequest("ADULT", 3);
    ticketService.purchaseTickets(accountId, requests);

    expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(
      1,
      75, // Tickets for 3 Adults are charged
    );
    expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(
      1,
      3, // Seats for 3 Adults are reserved
    );

    const requestsWithChild = [
      new TicketTypeRequest("ADULT", 2),
      new TicketTypeRequest("CHILD", 1),
    ];

    ticketService.purchaseTickets(accountId, ...requestsWithChild);
    expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(
      1,
      65, // Adult + Child tickets are charged
    );
    expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(
      1,
      3, // Adult + Child seats are reserved
    );
  });

  it("should not reserve seats for infants", () => {
    const requests = [
      new TicketTypeRequest("ADULT", 2),
      new TicketTypeRequest("CHILD", 1),
      new TicketTypeRequest("INFANT", 1),
    ];
    ticketService.purchaseTickets(accountId, ...requests);

    expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(
      1,
      65, // Adult + Child tickets are charged
    );
    expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(
      1,
      3, // Seat is not reserved for infant
    );
  });
});
