import { Test } from '@nestjs/testing';
import { TicketsController } from '../tickets.controller';
import { TicketsService } from '../tickets.service';
import { Ticket } from '@prisma/client';
import { CreateTicketWithUser } from '../types/create-ticket-with-user.type';
import { ListTicketsParamsReqDto } from '../dto/requests/list-tickets-params.dto';
import { PayTicketReqDto } from '../dto/requests/pay-ticket.dto';
import { randomUUID } from 'crypto';

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
];

describe('TicketsController', () => {
  let controller: TicketsController;
  // eslint-disable-next-line
  let service: TicketsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: TicketsService,
          useValue: {
            createTicket: jest.fn<Promise<Ticket>, [CreateTicketWithUser]>().mockImplementation(() => Promise.resolve(mockTickets[0])),
            listTickets: jest.fn<Promise<Ticket[]>, [ListTicketsParamsReqDto, string]>().mockImplementation(() => Promise.resolve(mockTickets)),
            getTicketById: jest.fn<Promise<Ticket>, [string, string]>().mockImplementation(() => Promise.resolve(mockTickets[0])),
            payForTicket: jest.fn<Promise<Ticket>, [PayTicketReqDto, string, string]>().mockImplementation(() => Promise.resolve(mockTickets[0])),
            cancelTicket: jest.fn<Promise<Ticket>, [string, string]>().mockImplementation(() => Promise.resolve(mockTickets[0])),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(TicketsService);
    controller = moduleRef.get(TicketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTicket', () => {
    it('should return a newly created ticket', () => {
      const createTicketData: CreateTicketWithUser = {
        ticketQuantity: 1,
        ticketPrice: 100,
        ticketEventId: '1',
        ticketUserId: '1',
      };

      expect(controller.createTicket(createTicketData, '1')).resolves.toEqual({
        data: mockTickets[0],
      });
    });
  });

  describe('listTickets', () => {
    it('should return tickets', () => {
      expect(controller.listTickets({}, '1')).resolves.toEqual({
        data: mockTickets,
      });
    });
  });

  describe('getTicketById', () => {
    it('should return a ticket', () => {
      expect(controller.getTicketById('1', '1')).resolves.toEqual({
        data: mockTickets[0],
      });
    });
  });

  describe('payTicket', () => {
    it('should return a paid ticket', () => {
      const payTicketData: PayTicketReqDto = {
        last4Digits: '4242',
        cardExpiry: '12/22',
        cardHolderName: 'Clyde',
        paymentToken: randomUUID(),
        paymentAmount: 100,
      };

      expect(controller.payTicket('1', '1', payTicketData)).resolves.toEqual({
        data: mockTickets[0],
      });
    });
  });

  describe('cancelTicket', () => {
    it('should return a canceled ticket', () => {
      expect(controller.cancelTicket('1', '1')).resolves.toEqual({
        data: mockTickets[0],
      });
    });
  });
});
