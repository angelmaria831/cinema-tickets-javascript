import TicketService from "../src/pairtest/TicketService";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";

describe("TicketService", () => {
  const ticketService = new TicketService();

  it("should throw error for invalid accountId", () => {
    const ticketRequest = new TicketTypeRequest("ADULT", 2);

    expect(() => {
      ticketService.purchaseTickets(0, ticketRequest);
    }).toThrow();

    expect(() => {
      ticketService.purchaseTickets(3.5, ticketRequest);
    }).toThrow();

    expect(() => {
      ticketService.purchaseTickets(-6, ticketRequest);
    }).toThrow();
  });
});
