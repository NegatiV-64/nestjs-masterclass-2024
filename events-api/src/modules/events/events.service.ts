import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { type CreateEventReqDto } from './dto/requests';
import { time } from 'src/shared/libs/time.lib';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';
import { UpdateEventReqDto } from './dto/requests/update-event-req.dto';
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

    const sortBy = searchParams.sort_by ?? 'eventCreatedAt';
    const sortOrder = searchParams.sort_order ?? 'asc';

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
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return events;
  }

  async updateEvent(eventID: string, dto: UpdateEventReqDto) {
    const existingEvent = await this.databaseService.event.findUnique({
      where: { eventId: eventID },
    });

    if (!existingEvent) throw new NotFoundException(`Event with ID ${eventID} not found.`);

    const updateEvent = await this.databaseService.event.update({
      where: { eventId: eventID },
      data: {
        ...dto,
        eventUpdatedAt: new Date(),
      },
    });
    return updateEvent;
  }

  async deleteEvent(eventId: string) {
    const existingEvent = await this.databaseService.event.findUnique({
      where: { eventId: eventId },
    });

    if (!existingEvent) throw new NotFoundException(`Event with ID ${eventId} not found.`);

    await this.databaseService.event.delete({
      where: { eventId: eventId },
    });
    return;
  }
}
