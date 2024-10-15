import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventReqDto } from './dto/requests';
import { ListEventsParamsReqDto } from './dto/requests/list-events-params.dto';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { Roles, RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/constants/user-role.constant';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SortEventsDto } from './dto/requests/sort-events.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(AuthTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'The event has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async createEvent(@Body() dto: CreateEventReqDto) {
    const createdEvent = await this.eventsService.createEvent(dto);

    return {
      data: createdEvent,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all events' })
  @ApiResponse({ status: 200, description: 'Returns a list of events.' })
  async listEvents(@Query() searchParams: ListEventsParamsReqDto) {
    const events = await this.eventsService.listEvents(searchParams);

    return {
      data: events,
    };
  }

  @Get(':eventId')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Returns the event data.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
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

  @Patch(':eventId')
  @ApiOperation({ summary: 'Update event by ID' })
  @ApiResponse({ status: 200, description: 'Event updated successfully.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async patchEventById(
    @Param(
      'eventId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    eventId: string,
    @Body() event: CreateEventReqDto,
  ) {
    const updatedEvent = await this.eventsService.updateEvent(eventId, event);
    return updatedEvent;
  }

  @Delete(':eventId')
  @ApiOperation({ summary: 'Delete event by ID' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async deleteEventById(
    @Param(
      'eventId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    eventId: string,
  ) {
    const deletedEvent = await this.eventsService.deleteEvent(eventId);
    return {
      deletedEvent
    };
  }


@Get('/sort')
@ApiOperation({ summary: 'Sort events' })
@ApiResponse({ status: 200, description: 'Events sorted successfully.' })
async sortEvents(@Query() query: SortEventsDto) {
  const { sort_by, sort_order } = query;
  const sortedEvents = await this.eventsService.sortEvents(sort_by, sort_order);
  return sortedEvents;
}

}
