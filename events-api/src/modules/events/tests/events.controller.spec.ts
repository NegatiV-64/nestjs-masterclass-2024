import { Test } from '@nestjs/testing';
import { EventsController } from '../events.controller';
import { EventsService } from '../events.service';
import { Event } from '@prisma/client';
import { CreateEventReqDto } from '../dto/requests';
import { ListEventsParamsReqDto } from '../dto/requests/list-events-params.dto';
import { UpdateEventReqDto } from '../dto/requests/update-event.dto';

const mockEvents: Event[] = [
  {
    eventId: '1',
    eventName: 'Event 1',
    eventDescription: 'Description 1',
    eventLocation: 'Location 1',
    eventDate: new Date(),
    eventCreatedAt: new Date(),
    eventUpdatedAt: new Date(),
  },
  {
    eventId: '2',
    eventName: 'Event 2',
    eventDescription: 'Description 2',
    eventLocation: 'Location 2',
    eventDate: new Date(),
    eventCreatedAt: new Date(),
    eventUpdatedAt: new Date(),
  },
];

describe('CatsController', () => {
  let controller: EventsController;
  // eslint-disable-next-line
  let service: EventsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: {
            createEvent: jest.fn<Promise<Event>, [CreateEventReqDto]>().mockImplementation(() => Promise.resolve(mockEvents[0])),
            getEventById: jest.fn<Promise<Event>, [string]>().mockImplementation(() => Promise.resolve(mockEvents[0])),
            listEvents: jest.fn<Promise<Event[]>, [ListEventsParamsReqDto]>().mockImplementation(() => Promise.resolve(mockEvents)),
            updateEvent: jest.fn<Promise<Event>, [UpdateEventReqDto, string]>().mockImplementation(() => Promise.resolve(mockEvents[0])),
            deleteEvent: jest.fn<Promise<Event>, [string]>().mockImplementation(() => Promise.resolve(mockEvents[0])),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(EventsService);
    controller = moduleRef.get(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEvent', () => {
    it('should return an event', async () => {
      const event: CreateEventReqDto = {
        eventName: 'Event 1',
        eventDescription: 'Description 1',
        eventLocation: 'Location 1',
        eventDate: new Date().toISOString(),
      };

      expect(controller.createEvent(event)).resolves.toEqual({ data: mockEvents[0] });
    });
  });

  describe('getEventById', () => {
    it('should return an event', async () => {
      expect(controller.getEventById('1')).resolves.toEqual({ data: mockEvents[0] });
    });
  });

  describe('listEvents', () => {
    it('should return an array of events', async () => {
      expect(controller.listEvents({})).resolves.toEqual({ data: mockEvents });
    });
  });

  describe('updateEvent', () => {
    it('should return updated event', async () => {
      const event: UpdateEventReqDto = {
        eventName: 'Event 1',
        eventDescription: 'Description 1',
        eventLocation: 'Location 1',
        eventDate: new Date().toISOString(),
      };

      expect(controller.updateEvent('1', event)).resolves.toEqual({ data: mockEvents[0] });
    });
  });

  describe('deleteEvent', () => {
    it('should return a deleted event', async () => {
      expect(controller.deleteEvent('1')).resolves.toEqual({ data: mockEvents[0] });
    });
  });
});
