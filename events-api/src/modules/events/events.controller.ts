import { Body, Controller, Get, HttpStatus, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventReqDto } from './dto/requests';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { Roles, RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/constants/user-role.constant';

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
  async getEventById(
    @Param(
      'eventId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    eventId: string,
  ) {
    const foundEvent = await this.eventsService.getEventById(eventId);

    return {
      data: foundEvent,
    };
  }
}
