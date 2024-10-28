import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { type CreateEventReqDto } from './dto/requests';
import { time } from 'src/shared/libs/time.lib';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';
import { SortBy } from 'src/modules/events/constants/sort-by.constant';
import { SortOrder } from 'src/shared/constants/sort-order.constant';

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
        ...dto,
        eventDate: time(dto.eventDate).toDate(),
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
    const sortBy = searchParams.sort_by ?? SortBy.EventCreatedAt;
    const sortOrder = searchParams.sort_order ?? SortOrder.Asc;
    const orderBy = {
      [sortBy]: sortOrder,
    };
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
      orderBy: orderBy,
    });

    return events;
  }
  async updateEvent(eventId: string, updateEventDto: CreateEventReqDto) {
    const foundEvent = await this.databaseService.event.findUnique({
      where: {
        eventId,
      },
    });

    if (!foundEvent) {
      throw new BadRequestException(`Event with id ${eventId} does not exist`);
    }
    
    return this.databaseService.event.update({
      where: {
        eventId,
      },
      data: { ...updateEventDto, eventDate: time(updateEventDto.eventDate).toDate() },
    });
  }

  async deleteEvent(eventId: string) {
    const foundEvent = await this.databaseService.event.findUnique({
      where: {
        eventId,
      },
    });

    if (!foundEvent) {
      throw new BadRequestException(`Event with id ${eventId} does not exist`);
    }
    return await this.databaseService.event.delete({
      where: { eventId },
    });
  }
}
