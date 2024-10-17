import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventReqDto } from './dto/requests';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { Roles, RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/constants/user-role.constant';
import { UpdateEventDto } from './dto/requests/update-event.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Create a new event' })
  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(AuthTokenGuard, RolesGuard)
  @ApiBody({ type: [CreateEventReqDto] })
  public async createEvent(@Body() dto: CreateEventReqDto) {
    const createdEvent = await this.eventsService.createEvent(dto);

    return {
      data: createdEvent,
    };
  }

  @ApiOperation({ summary: 'Fetche all events' })
  @Get()
  async listEvents(@Query() searchParams: ListEventsParamsReqDto) {
    const events = await this.eventsService.listEvents(searchParams);

    return {
      data: events,
    };
  }

  @ApiOperation({ summary: 'Fetche event by ID' })
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

  @ApiOperation({ summary: 'Update event by ID' })
  @Patch(':eventId')
  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBody({ type: [UpdateEventDto] })
  async updateEventById(
    @Param(
      'eventId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    eventId: string,
    @Body() updateData: UpdateEventDto,
  ) {
    const updatedEvent = await this.eventsService.updateEventById(eventId, updateData);

    return {
      data: updatedEvent,
    };
  }

  @ApiOperation({ summary: 'Delete event by ID' })
  @Delete(':eventId')
  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async deleteEvent(
    @Param(
      'eventId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    eventId: string,
  ) {
    const deletedEvent = await this.eventsService.deleteEventById(eventId);

    return {
      data: deletedEvent,
    };
  }
}
