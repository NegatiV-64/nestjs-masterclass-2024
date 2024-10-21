import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventReqDto } from './dto/requests';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { Roles, RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/constants/user-role.constant';
import { UpdateEventReqDto } from './dto/requests/update-event-req.dto';
import { UUIDParam } from 'src/shared/decorators/uuid-param.decorator';
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(AuthTokenGuard, RolesGuard)
  public async createEvent(@Body() dto: CreateEventReqDto) {
    const createdEvent = await this.eventsService.createEvent(dto);

    return {
      data: createdEvent,
    };
  }

  @Get()
  async listEvents(@Query() searchParams: ListEventsParamsReqDto) {
    const events = await this.eventsService.listEvents(searchParams);

    return {
      data: events,
    };
  }

  @Get(':eventId')
  async getEventById(@UUIDParam('eventId') eventId: string) {
    const foundEvent = await this.eventsService.getEventById(eventId);

    return {
      data: foundEvent,
    };
  }

  @Patch(':eventId')
  @Roles(UserRole.Admin)
  @UseGuards(AuthTokenGuard, RolesGuard)
  public async updateEventById(@UUIDParam('eventId') eventId: string, @Body() dto: UpdateEventReqDto) {
    const updatedEvent = await this.eventsService.updateEvent(eventId, dto);

    return {
      data: updatedEvent,
    };
  }

  @Delete(':eventId')
  @Roles(UserRole.Admin)
  @UseGuards(AuthTokenGuard, RolesGuard)
  async deleteEvent(@UUIDParam('eventId') eventId: string) {
    const event = await this.eventsService.deleteEvent(eventId);

    return {
      data: event,
    };
  }
}
