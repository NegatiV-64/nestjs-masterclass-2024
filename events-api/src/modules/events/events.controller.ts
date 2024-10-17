import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
  @Get()
  async getFilteredEvents(
    @Query('sort_by') sortBy: string = 'eventCreatedAt',
    @Query('sort_order') sortOrder: string = 'asc'
  ) {
    const allowedSortBy = ['eventName', 'eventDate', 'eventCreatedAt', 'eventUpdatedat'];
    const allowedSortOrder = ['asc', 'desc'];

    if(!allowedSortBy.includes(sortBy)) {
      throw new BadRequestException('Invalid sort by parameter')
    }

    if(!allowedSortOrder.includes(sortOrder)) {
      throw new BadRequestException('Invalid sort order parameter')
    }

    return this.eventsService.getSortedEvents(sortBy, sortOrder);
  }

  @Patch(':eventId')
  updateEvent(
    @Param('eventId') id: string,
    @Body()updateEventDto: CreateEventReqDto,
  ){
    return this.eventsService.updateEvent(id, updateEventDto)
  }

  @Delete(':eventId')
  deleteEvent(
    @Param('eventId') id: string,
  ){
    return this.eventsService.deleteEvent(id);
  }
}
