import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { type CreateEventReqDto } from './dto/requests';
import { time } from 'src/shared/libs/time.lib';
import { UpdateEventReqDto } from './dto/requests/update-event.dto';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';

@Injectable()
export class EventsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getFirstByName(eventName: CreateEventReqDto['eventName']) {
    return await this.databaseService.event.findFirst({
      where: {
        eventName,
      },
      select: {
        eventId: true,
      },
    });
  }

  async create(dto: CreateEventReqDto) {
    return await this.databaseService.event.create({
      data: {
        eventDate: time(dto.eventDate).toDate(),
        eventDescription: dto.eventDescription,
        eventLocation: dto.eventLocation,
        eventName: dto.eventName,
      },
    });
  }

  async getById(eventId: string) {
    return await this.databaseService.event.findUnique({
      where: {
        eventId,
      },
    });
  }

  async getAll(searchParams: ListEventsParamsReqDto) {
    const page = searchParams.page ?? 1;
    const limit = searchParams.limit ?? 20;
    const orderByQuery = {};

    if (searchParams.sortBy) {
      orderByQuery[searchParams.sortBy] = searchParams.sortOrder ?? 'asc';
    }

    return await this.databaseService.event.findMany({
      where: {
        eventName: {
          contains: searchParams.name,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: orderByQuery,
    });
  }

  async update(dto: UpdateEventReqDto, eventId: string) {
    return await this.databaseService.event.update({
      where: {
        eventId: eventId,
      },
      data: {
        eventDate: time(dto.eventDate).toDate(),
        eventDescription: dto.eventDescription,
        eventLocation: dto.eventLocation,
        eventName: dto.eventName,
      },
    });
  }

  async delete(eventId: string) {
    return await this.databaseService.event.delete({
      where: {
        eventId,
      },
    });
  }
}
