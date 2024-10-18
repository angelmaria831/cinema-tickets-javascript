import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";

describe("TicketTypeRequest", () => {
  it("should create TicketTypeRequest for valid ticket types and noOfTickets", () => {
    const adultTicket = new TicketTypeRequest("ADULT", 3);
    expect(adultTicket.getTicketType()).toBe("ADULT");
    expect(adultTicket.getNoOfTickets()).toBe(3);

    const childTicket = new TicketTypeRequest("CHILD", 2);
    expect(childTicket.getTicketType()).toBe("CHILD");
    expect(childTicket.getNoOfTickets()).toBe(2);

    const infantTicket = new TicketTypeRequest("INFANT", 1);
    expect(infantTicket.getTicketType()).toBe("INFANT");
    expect(infantTicket.getNoOfTickets()).toBe(1);
  });

  it("should throw error for invalid ticket type", () => {
    expect(() => {
      new TicketTypeRequest("SENIOR", 2);
    }).toThrow(TypeError);

    expect(() => {
      new TicketTypeRequest("ADULTS", 4);
    }).toThrow(TypeError);
  });

  it("should throw error for non-integer noOfTickets", () => {
    expect(() => {
      new TicketTypeRequest("ADULT", "two");
    }).toThrow(TypeError);

    expect(() => {
      new TicketTypeRequest("ADULT", 2.5);
    }).toThrow(TypeError);
  });
});
