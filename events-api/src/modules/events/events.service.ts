import { UpdateEventReqDto } from './dto/requests/update-event.dto';
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
    const { page = 1, limit = 20, sort_by, sort_order = 'asc', name  } = searchParams

    const events = await this.databaseService.event.findMany({
      where: {
        eventName: name
          ? { contains: name }
          : undefined,
      },

      orderBy: sort_by && sort_order
        ? { [sort_by]: sort_order }
        : undefined,

      skip: (page - 1) * limit,
      take: limit,
    });

    return events;
  }


  async updateEvent(eventId: string, dto: UpdateEventReqDto) {
    const { eventDate, eventDescription, eventLocation, eventName } = dto

    const existingEventById = await this.databaseService.event.findFirst({
      where: {
        eventId,
      },
    });

    if (!existingEventById) {
      throw new BadRequestException('Event not found');
    }

    const dataToUpdate: any = {};

    if (eventDate) {
      dataToUpdate.eventDate = time(eventDate).toDate();
    }
    if (eventDescription) {
      dataToUpdate.eventDescription = eventDescription;
    }
    if (eventLocation) {
      dataToUpdate.eventLocation = eventLocation;
    }
    if (eventName) {
      dataToUpdate.eventName = eventName;
    }

    const updatedEvent = await this.databaseService.event.update({
      where: {
        eventId,
      },
      data: dataToUpdate,
    });

    return updatedEvent;
  }

  async deleteEventById(eventId: string) {
    const foundEvent = await this.databaseService.event.findFirst({
      where: {
        eventId,
      },
    });

    if (!foundEvent) {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }

    const deletedEvent = await this.databaseService.event.delete({
      where: {
        eventId,
      }
    })

    return deletedEvent;
  }
}
