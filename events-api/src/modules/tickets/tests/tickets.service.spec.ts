import { Event, Ticket } from '@prisma/client';
import { TicketsRepository } from '../tickets.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from '../tickets.service';
import { CreateTicketWithUser } from '../types/create-ticket-with-user.type';
import { EventsRepository } from 'src/modules/events/events.repository';
import { TicketPaymentsService } from 'src/modules/ticket-payments/ticket-payments.service';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PayTicketReqDto } from '../dto/requests/pay-ticket.dto';

const mockTickets: Ticket[] = [
  {
    ticketId: '1',
    ticketQuantity: 1,
    ticketPrice: 100,
    ticketUserId: '1',
    ticketEventId: '1',
    ticketTransactionId: '1',
    ticketStatus: 'pending',
    ticketCreatedAt: new Date(),
    ticketUpdatedAt: new Date(),
  },
  {
    ticketId: '2',
    ticketQuantity: 1,
    ticketPrice: 100,
    ticketUserId: '2',
    ticketEventId: '2',
    ticketTransactionId: '2',
    ticketStatus: 'paid',
    ticketCreatedAt: new Date(),
    ticketUpdatedAt: new Date(),
  },
  {
    ticketId: '3',
    ticketQuantity: 1,
    ticketPrice: 100,
    ticketUserId: '1',
    ticketEventId: '3',
    ticketTransactionId: '3',
    ticketStatus: 'cancelled',
    ticketCreatedAt: new Date(),
    ticketUpdatedAt: new Date(),
  },
];

const mockEvent: Event = {
  eventId: '1',
  eventName: 'Event 1',
  eventDescription: 'Description 1',
  eventLocation: 'Location 1',
  eventDate: new Date(),
  eventCreatedAt: new Date(),
  eventUpdatedAt: new Date(),
};

const mockTicketsRepository = {
  create: jest.fn().mockResolvedValue(mockTickets[0]),
  getAllByUserId: jest.fn().mockResolvedValue(mockTickets),
  getById: jest.fn().mockImplementation((ticketId: string) => {
    if (ticketId === 'Non-existing ticket id') {
      return null;
    }

    if (ticketId === 'paid ticket id') {
      return mockTickets[1];
    }

    if (ticketId === 'cancelled ticket id') {
      return mockTickets[2];
    }

    return mockTickets[0];
  }),
  updateById: jest.fn().mockResolvedValue(mockTickets[0]),
};

const mockTicketPaymentsService = {
  processPayment: jest.fn().mockResolvedValue({ message: '', transactionId: '1' }),
};

const mockEventsRepository = {
  getById: jest.fn().mockImplementation((eventId: string) => {
    if (eventId === 'Non-existing event id') {
      return null;
    }

    return mockEvent;
  }),
};

describe('TicketsService', () => {
  let service: TicketsService;
  /* eslint-disable */
  let ticketsRepository: TicketsRepository;
  let ticketPaymentsService: TicketPaymentsService;
  let eventsRepository: EventsRepository;
  /* eslint-enable */

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: TicketsRepository, useValue: mockTicketsRepository },
        { provide: TicketPaymentsService, useValue: mockTicketPaymentsService },
        { provide: EventsRepository, useValue: mockEventsRepository },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    ticketsRepository = module.get<TicketsRepository>(TicketsRepository);
    ticketPaymentsService = module.get<TicketPaymentsService>(TicketPaymentsService);
    eventsRepository = module.get<EventsRepository>(EventsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTicket', () => {
    it('should return a newly created ticket', () => {
      const createTicketData: CreateTicketWithUser = {
        ticketQuantity: 1,
        ticketPrice: 100,
        ticketUserId: '1',
        ticketEventId: '1',
      };

      expect(service.createTicket(createTicketData)).resolves.toEqual(mockTickets[0]);
    });

    it('should throw an bad request error if event does not exist', async () => {
      const createTicketData: CreateTicketWithUser = {
        ticketQuantity: 1,
        ticketPrice: 100,
        ticketUserId: '1',
        ticketEventId: 'Non-existing event id',
      };

      expect(service.createTicket(createTicketData)).rejects.toThrow(BadRequestException);
    });
  });

  describe('listTickets', () => {
    it('should return tickets', () => {
      expect(service.listTickets({}, '1')).resolves.toEqual(mockTickets);
    });
  });

  describe('getTicketById', () => {
    it('should return a ticket', () => {
      expect(service.getTicketById('1', '1')).resolves.toEqual(mockTickets[0]);
    });

    it('should throw an bad request error if ticket does not exist', async () => {
      expect(service.getTicketById('Non-existing ticket id', '1')).rejects.toThrow(BadRequestException);
    });

    it('should throw an bad request error if user is not creator of ticket', async () => {
      expect(service.getTicketById('1', '2')).rejects.toThrow(BadRequestException);
    });
  });

  describe('payForTicket', () => {
    const payTicketData: PayTicketReqDto = {
      last4Digits: '4242',
      cardExpiry: '12/22',
      cardHolderName: 'Clyde',
      paymentToken: randomUUID(),
      paymentAmount: 100,
    };

    it('should return a paid ticket', () => {
      expect(service.payForTicket(payTicketData, '1', '1')).resolves.toEqual(mockTickets[0]);
    });

    it('should throw a bad request error if ticket does not exist', async () => {
      expect(service.payForTicket(payTicketData, 'Non-existing ticket id', '1')).rejects.toThrow(BadRequestException);
    });

    it('should throw a bad request error if user is not creator of ticket', async () => {
      expect(service.payForTicket(payTicketData, '1', '2')).rejects.toThrow(BadRequestException);
    });

    it('should throw a bad request error if ticket is already paid', async () => {
      expect(service.payForTicket(payTicketData, 'paid ticket id', '1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelTicket', () => {
    it('should return a canceled ticket', () => {
      expect(service.cancelTicket('1', '1')).resolves.toEqual(mockTickets[0]);
    });

    it('should throw a bad request error if ticket does not exist', async () => {
      expect(service.cancelTicket('Non-existing ticket id', '1')).rejects.toThrow(BadRequestException);
    });

    it('should throw a bad request error if user is not creator of ticket', async () => {
      expect(service.cancelTicket('1', '2')).rejects.toThrow(BadRequestException);
    });

    it('should throw a bad request error if ticket is already cancelled', async () => {
      expect(service.cancelTicket('cancelled ticket id', '1')).rejects.toThrow(BadRequestException);
    });
  });
});
