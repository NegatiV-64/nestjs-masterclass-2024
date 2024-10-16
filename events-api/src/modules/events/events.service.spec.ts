import { Test } from '@nestjs/testing';
import { CreateEventReqDto, ListEventsParamsReqDto } from './dto/requests';
import { EventsService } from './events.service';
import { DatabaseService } from '../database/database.service';
import { EventDto } from './dto/event.dto';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationConfig } from 'src/shared/configs/validation.config';
import { APP_PIPE } from '@nestjs/core';
import { Context, createMockContext, MockContext } from '../../context';

describe('EventsController', () => {
  let eventsService: EventsService;
  let validationPipe: ValidationPipe;
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    const moduleRef = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: DatabaseService,
          useValue: ctx,
        },
        {
          provide: APP_PIPE,
          useValue: ValidationConfig,
        },
      ],
    }).compile();

    eventsService = moduleRef.get(EventsService);
    validationPipe = ValidationConfig;
  });

  describe('createEvent', () => {
    it('should return single created event', async () => {
      const requestBody: CreateEventReqDto = {
        eventName: 'Some Event Name',
        eventDescription: 'Some Event Description',
        eventLocation: 'Some Event Location',
        eventDate: '2024-12-12 12:12',
      };

      const result = {
        eventId: 'string',
        ...requestBody,
        eventCreatedAt: new Date(),
        eventUpdatedAt: new Date(),
      };
      // jest.spyOn(eventsService, 'createEvent').mockResolvedValue(result as any);

      // try {
      await validationPipe.transform(requestBody, { type: 'body', metatype: CreateEventReqDto });
      expect(eventsService.createEvent(requestBody)).resolves.toBe(result);
      // } catch (error) {
      // expect(error).toBeInstanceOf(BadRequestException);
      // }
    });
  });

  describe('listEvents', () => {
    it('should return an array of events', async () => {
      const searchParams: ListEventsParamsReqDto = {};
      const result: EventDto[] = [
        {
          eventId: 'string',
          eventName: 'string',
          eventDescription: 'string',
          eventLocation: 'string',
          eventDate: new Date(),
          eventCreatedAt: new Date(),
          eventUpdatedAt: new Date(),
        },
      ];
      jest.spyOn(eventsService, 'listEvents').mockResolvedValue(result);

      expect(await eventsService.listEvents(searchParams)).toEqual(result);
    });
  });
});
