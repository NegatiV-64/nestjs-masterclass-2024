import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventReqDto } from './dto/requests';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { Roles, RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/constants/user-role.constant';
import { UUIDPipeOptions } from 'src/shared/constants/uuid-pipe-options.constant';
import { UpdateEventReqDto } from './dto/requests/update-event.dto';
import { SnakeToCamelCasePipe } from 'src/shared/pipes/snake-to-camel-case.pipe';

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
  @UsePipes(new SnakeToCamelCasePipe())
  async listEvents(@Query() searchParams: ListEventsParamsReqDto) {
    const events = await this.eventsService.listEvents(searchParams);

    return {
      data: events,
    };
  }

  @Get(':eventId')
  async getEventById(
    @Param('eventId', new ParseUUIDPipe(UUIDPipeOptions))
    eventId: string,
  ) {
    const foundEvent = await this.eventsService.getEventById(eventId);

    return {
      data: foundEvent,
    };
  }

  @Patch(':eventId')
  @Roles(UserRole.Admin)
  @UseGuards(AuthTokenGuard, RolesGuard)
  async updateEvent(
    @Param('eventId', new ParseUUIDPipe(UUIDPipeOptions))
    eventId: string,
    @Body()
    dto: UpdateEventReqDto,
  ) {
    const updatedEvent = await this.eventsService.updateEvent(dto, eventId);

    return {
      data: updatedEvent,
    };
  }

  @Delete(':eventId')
  @Roles(UserRole.Admin)
  @UseGuards(AuthTokenGuard, RolesGuard)
  async deleteEvent(@Param('eventId', new ParseUUIDPipe(UUIDPipeOptions)) eventId: string) {
    const deletedEvent = await this.eventsService.deleteEvent(eventId);

    return {
      data: deletedEvent,
    };
  }
}
