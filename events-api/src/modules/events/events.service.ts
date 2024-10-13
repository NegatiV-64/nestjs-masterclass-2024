import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { type CreateEventReqDto } from './dto/requests';
import { time } from 'src/shared/libs/time.lib';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';

@Injectable()
export class EventsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createEvent(dto: CreateEventReqDto) {
    const existingEventByName = await this.databaseService.event.findFirst({
      where: {
        eventName: dto.eventName,
      },
      select: {
        eventId: true,
      },
    });
    if (existingEventByName) {
      throw new BadRequestException('Event with this name already exists');
    }

    const createdEvent = await this.databaseService.event.create({
      data: {
        eventDate: time(dto.eventDate).toDate(),
        eventDescription: dto.eventDescription,
        eventLocation: dto.eventLocation,
        eventName: dto.eventName,
      },
    });

    return createdEvent;
  }

  async getEventById(eventId: string) {
    const foundEvent = await this.databaseService.event.findUnique({
      where: {
        eventId,
      },
    });

    if (!foundEvent) {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }

    return foundEvent;
  }

  async listEvents(searchParams: ListEventsParamsReqDto) {
    const page = searchParams.page ?? 1;
    const limit = searchParams.limit ?? 20;

    const events = await this.databaseService.event.findMany({
      where: {
        eventName: searchParams.name
          ? {
              contains: searchParams.name,
            }
          : undefined,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return events;
  }
  async updateEvent(eventId: string, event: CreateEventReqDto) {
    const foundEvent = await this.databaseService.event.findUnique({
      where: {
        eventId,
      },
    });

    if (!foundEvent) {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }

    const updatedEvent = await this.databaseService.event.update({
      where: {
        eventId,
      },
      data: {
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        eventLocation: event.eventLocation,
        eventDate: new Date(event.eventDate),
      },
    });
    return updatedEvent;
  }
  async deleteEvent(eventId: string) {
    const foundEvent = await this.databaseService.event.findUnique({
      where: {
        eventId,
      },
    });
    if (!foundEvent) {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }
    await this.databaseService.event.delete({
      where: {
        eventId,
      },
    });
    return 'Event deleted successfully';
  }
  async sortEvents(sortBy: string, sortOrder: string) {
    console.log(`Sorting events by: ${sortBy}, sortOrder: ${sortOrder}`);

    try {
      const events = await this.databaseService.event.findMany({
        orderBy: {
          [sortBy]: sortOrder
        },
      });
      return events;
    } catch (error) {
      console.error('Error while querying the database:', error);
      throw error; 
    }
  }
}
