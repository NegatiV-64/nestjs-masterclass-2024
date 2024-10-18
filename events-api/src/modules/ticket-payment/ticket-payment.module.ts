import { Module } from "@nestjs/common";
import { TicketPaymentService } from "./ticket-payment.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    providers: [TicketPaymentService],
    exports: [TicketPaymentService],
    imports: [HttpModule]
})
export class TicketPaymentModule {}
