import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateEventReqDto, UpdateEventReqDto, ListEventsParamsReqDto } from './dto/requests';
import { EventResponseDto, ListEventsResponseDto } from './dto/responses';
import { EventsService } from './events.service';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { Roles, RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/constants/user-role.constant';

@Controller('events')
@ApiTags('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiCreatedResponse({ description: 'Event created successfully', type: EventResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiBadRequestResponse({ description: 'Invalid request body provided' })
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @UseGuards(AuthTokenGuard, RolesGuard)
  public async createEvent(@Body() dto: CreateEventReqDto) {
    const createdEvent = await this.eventsService.createEvent(dto);

    return {
      data: createdEvent,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of events' })
  @ApiOkResponse({ description: 'List of events retrieved successfully', type: ListEventsResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters provided' })
  async listEvents(@Query() searchParams: ListEventsParamsReqDto) {
    const events = await this.eventsService.listEvents(searchParams);

    return {
      data: events,
    };
  }

  @Get(':eventId')
  @ApiOperation({ summary: 'Get a single event by ID' })
  @ApiOkResponse({ description: 'Event retrieved successfully', type: EventResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid ID provided' })
  @ApiNotFoundResponse({ description: 'Event not found' })
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
  @ApiOperation({ summary: 'Update an existing event' })
  @ApiOkResponse({ description: 'Event updated successfully', type: EventResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiBadRequestResponse({ description: 'Invalid or non-existent ID provided' })
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @UseGuards(AuthTokenGuard, RolesGuard)
  public async updateEvent(
    @Param(
      'eventId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    eventId: string,
    @Body() dto: UpdateEventReqDto,
  ) {
    const updatedEvent = await this.eventsService.updateEvent(eventId, dto);

    return {
      data: updatedEvent,
    };
  }

  @Delete(':eventId')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiOkResponse({ description: 'Event deleted successfully', type: EventResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiBadRequestResponse({ description: 'Invalid or non-existent ID provided' })
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @UseGuards(AuthTokenGuard, RolesGuard)
  public async deleteEvent(
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
      data: deletedEvent,
    };
  }
}
