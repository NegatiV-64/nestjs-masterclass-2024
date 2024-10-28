import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateEventReqDto } from './dto/requests';
import { time } from 'src/shared/libs/time.lib';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';
import { UpdateEventReqDto } from './dto/requests/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createEvent(dto: CreateEventReqDto) {
    const existingEventByName = await this.databaseService.event.findFirst({
      where: { eventName: dto.eventName },
      select: { eventId: true },
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
    const foundEvent = await this.databaseService.event.findUnique({ where: { eventId } });
    if (!foundEvent) throw new NotFoundException(`Event with id ${eventId} not found`);
    return foundEvent;
  }

  async updateEventById(eventId: string, dto: UpdateEventReqDto) {
    const event = await this.databaseService.event.findUnique({ where: { eventId } });
    if (!event) throw new BadRequestException(`Event with id ${eventId} not found`);

    const updatedEvent = await this.databaseService.event.update({
      where: { eventId },
      data: {
        eventName: dto.eventName,
        eventDescription: dto.eventDescription,
        eventLocation: dto.eventLocation,
        eventDate: time(dto.eventDate).toDate(),
      },
    });

    return updatedEvent;
  }

  async deleteEventById(eventId: string) {
    const event = await this.databaseService.event.findUnique({ where: { eventId } });
    if (!event) throw new BadRequestException(`Event with id ${eventId} not found`);

    const deletedEvent = await this.databaseService.event.delete({ where: { eventId } });
    return deletedEvent;
  }

  async listEvents(searchParams: ListEventsParamsReqDto) {
    const { page = 1, limit = 20, sort_by = 'eventDate', sort_order = 'asc', name } = searchParams;
    const orderBy = { [sort_by]: sort_order };

    const events = await this.databaseService.event.findMany({
      where: name ? { eventName: { contains: name } } : undefined,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    });

    return events;
  }
}
