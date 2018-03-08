import {
    Authenticated,
    BodyParams,
    Controller,
    Delete,
    Get,
    MergeParams,
    PathParams,
    Post,
    Put,
    Required,
    Status,
    UseBefore
} from "@tsed/common";
import {Description, Summary} from "ts-express-decorators/lib/swagger";
import {NotFound} from "ts-httpexceptions";
import {CheckCalendarIdMiddleware} from "../../middlewares/CheckCalendarId";
import {CalendarEvent} from "../../models/CalendarEvent";
import {CalendarEventsService} from "../../services/CalendarEventsService";


@Controller("/:calendarId/events")
@MergeParams(true)
export class EventCtrl {
    constructor(private calendarEventsService: CalendarEventsService) {

    }

    /**
     *
     * @returns {null}
     */
    @Get("/:id")
    @UseBefore(CheckCalendarIdMiddleware)
    @Summary("Get an event from his ID")
    @Status(200, {description: "Success"})
    async get(@Description("The event id")
              @PathParams("id") id: string): Promise<CalendarEvent> {
        return this.calendarEventsService
            .find(id)
            .catch((err) => {
                throw new NotFound("Event not found");
            });
    }

    /**
     *
     * @returns {null}
     */
    @Put("/")
    @UseBefore(CheckCalendarIdMiddleware)
    @Summary("Create an event")
    @Status(201, {description: "Created"})
    async save(@Description("The calendar id of the event")
               @Required() @PathParams("calendarId") calendarId: string,
               @BodyParams() calendarEvent: CalendarEvent): Promise<CalendarEvent> {

        calendarEvent.calendarId = calendarId;

        return this.calendarEventsService.save(calendarEvent);
    }

    /**
     *
     * @returns {null}
     */
    @Post("/:id")
    @UseBefore(CheckCalendarIdMiddleware)
    @Summary("Update event information")
    @Status(200, {description: "Success"})
    async update(@Description("The calendar id of the event")
                 @Required()
                 @PathParams("calendarId") calendarId: string,
                 @Description("The event id")
                 @PathParams("id") id: string,
                 @BodyParams() calendarEvent: CalendarEvent): Promise<CalendarEvent> {

        return this
            .calendarEventsService
            .find(id)
            .then(() => this.calendarEventsService.save(calendarEvent))
            .catch((err) => {
                throw new NotFound("Calendar id not found");
            });
    }

    /**
     *
     */
    @Delete("/:id")
    @Authenticated()
    @UseBefore(CheckCalendarIdMiddleware)
    @Summary("Remove an event")
    @Status(204, {description: "No content"})
    async remove(@Description("The calendar id of the event")
                 @Required() @PathParams("calendarId") calendarId: string,
                 @Description("The event id")
                 @PathParams("id") id: string): Promise<void> {
        return this.calendarEventsService.remove(id);
    }

    @Get("/")
    @UseBefore(CheckCalendarIdMiddleware)
    @Summary("Get all events for a calendar")
    @Status(200, {description: "Success"})
    async getEvents(@Description("The calendar id of the event")
                    @Required() @PathParams("calendarId") calendarId: string): Promise<CalendarEvent[]> {
        return this.calendarEventsService.query(calendarId);
    }
}