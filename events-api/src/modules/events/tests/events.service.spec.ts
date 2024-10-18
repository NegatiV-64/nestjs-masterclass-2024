import { CreateEventReqDto } from '../dto/requests';
import { Event } from '@prisma/client';
import { EventsRepository } from '../events.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from '../events.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
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

const mockEventsRepository = {
  getFirstByName: jest.fn().mockImplementation((eventName: CreateEventReqDto['eventName']) => {
    if (eventName === 'Existing event name') {
      return { eventId: mockEvents[0].eventId };
    }

    return null;
  }),
  create: jest.fn().mockResolvedValue(mockEvents[0]),
  getById: jest.fn().mockImplementation((eventId: string) => {
    if (eventId === 'Non-existing event id') {
      return null;
    }

    return mockEvents[0];
  }),
  getAll: jest.fn().mockResolvedValue(mockEvents),
  update: jest.fn<Promise<Event>, [UpdateEventReqDto]>().mockResolvedValue(mockEvents[0]),
  delete: jest.fn().mockResolvedValue(mockEvents[0]),
};

describe('EventsService', () => {
  let service: EventsService;
  // eslint-disable-next-line
  let eventsRepository: EventsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService, { provide: EventsRepository, useValue: mockEventsRepository }],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventsRepository = module.get<EventsRepository>(EventsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEvent', () => {
    it('should create an event and return it', () => {
      const createEventReqDto: CreateEventReqDto = {
        eventName: 'Event 1',
        eventDescription: 'Description 1',
        eventLocation: 'Location 1',
        eventDate: new Date().toISOString(),
      };

      expect(service.createEvent(createEventReqDto)).resolves.toEqual(mockEvents[0]);
    });

    it('should throw an exception if event with the same name already exists', () => {
      const createEventReqDto: CreateEventReqDto = {
        eventName: 'Existing event name',
        eventDescription: 'Description 1',
        eventLocation: 'Location 1',
        eventDate: new Date().toISOString(),
      };

      expect(service.createEvent(createEventReqDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getEventById', () => {
    it('should return an event by id', () => {
      expect(service.getEventById(mockEvents[0].eventId)).resolves.toEqual(mockEvents[0]);
    });

    it('should throw exception if event does not exist', () => {
      expect(service.getEventById('Non-existing event id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('listEvents', () => {
    it('should return a list of events', () => {
      expect(service.listEvents({})).resolves.toEqual(mockEvents);
    });
  });

  describe('updateEvent', () => {
    it('should update an event and return it', () => {
      const updateEventReqDto = {
        eventName: 'Event 1',
      };

      expect(service.updateEvent(updateEventReqDto, mockEvents[0].eventId)).resolves.toEqual(mockEvents[0]);
    });

    it('should throw an exception if event does not exist', () => {
      const updateEventReqDto = {
        eventName: 'Event 1',
      };

      expect(service.updateEvent(updateEventReqDto, 'Non-existing event id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event and return it', () => {
      expect(service.deleteEvent(mockEvents[0].eventId)).resolves.toEqual(mockEvents[0]);
    });

    it('should throw an exception if event does not exist', () => {
      expect(service.deleteEvent('Non-existing event id')).rejects.toThrow(BadRequestException);
    });
  });
});
