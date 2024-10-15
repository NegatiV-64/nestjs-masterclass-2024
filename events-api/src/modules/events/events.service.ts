import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { type CreateEventReqDto } from './dto/requests';
import { type ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';
import { EventsRepository } from './events.repository';
import { UpdateEventReqDto } from './dto/requests/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async createEvent(dto: CreateEventReqDto) {
    const existingEventByName = await this.eventsRepository.getFirstByName(dto.eventName);

    if (existingEventByName) {
      throw new BadRequestException('Event with this name already exists');
    }

    const createdEvent = await this.eventsRepository.create(dto);

    return createdEvent;
  }

  async getEventById(eventId: string) {
    const foundEvent = await this.eventsRepository.getById(eventId);

    if (!foundEvent) {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }

    return foundEvent;
  }

  async listEvents(searchParams: ListEventsParamsReqDto) {
    return this.eventsRepository.getAll(searchParams);
  }

  async updateEvent(dto: UpdateEventReqDto, eventId: string) {
    const event = await this.eventsRepository.getById(eventId);

    if (!event) {
      throw new BadRequestException(`Event with id ${eventId} not found`);
    }

    return await this.eventsRepository.update(dto, eventId);
  }

  }
}
