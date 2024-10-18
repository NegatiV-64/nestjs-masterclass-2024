import { CreateEventReqDto } from "../dto/requests";

export interface CreateEventArgs {
    dto: CreateEventReqDto;
    requestId: string;
}
