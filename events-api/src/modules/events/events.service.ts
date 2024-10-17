import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { type CreateEventReqDto } from './dto/requests';
import { time } from 'src/shared/libs/time.lib';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';
import { UpdateEventDto } from './dto/requests/update-event.dto';

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
    const sortBy = searchParams.sort_by ?? "eventDate";
    const sortOrder = searchParams.sort_order ?? "asc";

    const events = await this.databaseService.event.findMany({
      orderBy: {
        [sortBy]: sortOrder
      },

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

  async updateEventById(eventId: string, updateData: UpdateEventDto) {
    await this.getEventById(eventId);

    return this.databaseService.event.update({
      where: {
        eventId,
      },
      data: updateData
    })
  }

  async deleteEventById(eventId: string,) {
    await this.getEventById(eventId);

    return this.databaseService.event.delete({
      where: {
        eventId,
      }
    })
  }
}
