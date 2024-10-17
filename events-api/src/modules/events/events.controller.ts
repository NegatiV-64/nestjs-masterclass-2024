import { ParsingUUIDPipe } from '../../shared/pipes/uuid-params.pipe';
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventReqDto } from './dto/requests';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { Roles, RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/constants/user-role.constant';
import { UpdateEventReqDto } from './dto/requests/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(AuthTokenGuard, RolesGuard)
  public async createEvent(@Body() dto: CreateEventReqDto) {
    const createdEvent = await this.eventsService.createEvent(dto);

    return {
      message: 'Event succesfully created',
      data: createdEvent,
    };
  }

  @Get()
  async listEvents(@Query() searchParams: ListEventsParamsReqDto) {
    const events = await this.eventsService.listEvents(searchParams);

    return {
      message: 'Events succesfully received',
      data: events,
    };
  }

  @Get(':eventId')
  async getEventById(
    @Param('eventId', ParsingUUIDPipe)
    eventId: string,
  ) {
    const foundEvent = await this.eventsService.getEventById(eventId);

    return {
      message: 'Event succesfully received',
      data: foundEvent,
    };
  }

  @Patch(':eventId')
  @Roles(UserRole.Admin)
  @UseGuards(AuthTokenGuard, RolesGuard)
  public async updateEvent(
    @Param('eventId', ParsingUUIDPipe)
    eventId: string,

    @Body() dto: UpdateEventReqDto
  ) {
    const updatedEvent = await this.eventsService.updateEvent(eventId, dto);

    return {
      message: 'Event succesfully updated',
      data: updatedEvent,
    };
  }

  @Delete(':eventId')
  async deleteEvent(
    @Param('eventId', ParsingUUIDPipe)
    eventId: string,
  ) {
    const deletedEvent = await this.eventsService.deleteEventById(eventId);

    return {
      message: 'Event succesfully deleted',
      data: deletedEvent,
    };
  }
}
