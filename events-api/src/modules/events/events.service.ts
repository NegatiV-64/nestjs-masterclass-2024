import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { type CreateEventReqDto, type UpdateEventReqDto } from './dto/requests';
import { time } from 'src/shared/libs/time.lib';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';

@Injectable()
export class EventsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createEvent(dto: CreateEventReqDto) {
    const eventNameExists = await this.checkIfEventNameExists(dto.eventName);

    if (eventNameExists) {
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
    const eventExists = await this.checkIfEventExists(eventId);

    if (!eventExists) {
      throw new BadRequestException('Event does not exist');
    }

    const eventNameExists = dto.eventName ? await this.checkIfEventNameExists(dto.eventName) : false;

    if (eventNameExists) {
      throw new BadRequestException('Event with this name already exists');
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
    const eventExists = await this.checkIfEventExists(eventId);

    if (!eventExists) {
      throw new BadRequestException(`Event with id ${eventId} does not exist`);
    }

    const deletedEvent = await this.databaseService.event.delete({
      where: {
        eventId,
      },
    });

    return deletedEvent;
  }

  async checkIfEventExists(eventId: string) {
    const event = await this.databaseService.event.findUnique({
      where: {
        eventId,
      },
      select: {
        eventId: true,
      },
    });

    if (!event) {
      return false;
    }

    return true;
  }

  private async checkIfEventNameExists(eventName: string) {
    const existingEventByName = await this.databaseService.event.findFirst({
      where: {
        eventName,
      },
      select: {
        eventId: true,
      },
    });

    if (!existingEventByName) {
      return false;
    }

    return true;
  }
}
