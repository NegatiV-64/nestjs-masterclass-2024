import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { type CreateEventReqDto, type UpdateEventReqDto } from './dto/requests';
import { time } from 'src/shared/libs/time.lib';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';

@Injectable()
export class EventsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createEvent(dto: CreateEventReqDto) {
    await this.verifyNameUniqueness(dto.eventName);

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
    const sortBy = searchParams.sort_by ?? 'eventCreatedAt';
    const sortOrder = searchParams.sort_order ?? 'desc';

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
      orderBy: { [sortBy]: sortOrder },
    });

    return events;
  }

  async updateEvent(eventId: string, dto: UpdateEventReqDto) {
    await this.verifyEventExistence(eventId);

    if (dto.eventName) {
      await this.verifyNameUniqueness(dto.eventName);
    }

    const updatedEvent = await this.databaseService.event.update({
      where: {
        eventId,
      },
      data: {
        eventDate: time(dto.eventDate).toDate(),
        eventDescription: dto.eventDescription,
        eventLocation: dto.eventLocation,
        eventName: dto.eventName,
      },
    });

    return updatedEvent;
  }

  async deleteEvent(eventId: string) {
    await this.verifyEventExistence(eventId);

    const deletedEvent = await this.databaseService.event.delete({
      where: {
        eventId,
      },
    });

    return deletedEvent;
  }

  private async verifyEventExistence(eventId: string) {
    const existingEvent = await this.databaseService.event.findUnique({
      where: {
        eventId,
      },
      select: {
        eventId: true,
      },
    });

    if (!existingEvent) {
      throw new BadRequestException(`Event with id ${eventId} does not exist`);
    }
  }

  private async verifyNameUniqueness(eventName: string) {
    const existingEventByName = await this.databaseService.event.findFirst({
      where: {
        eventName,
      },
      select: {
        eventId: true,
      },
    });

    if (existingEventByName) {
      throw new BadRequestException('Event with this name already exists');
    }
  }
}
