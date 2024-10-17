import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PaymentDto } from './dto/payment.dto';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/shared/configs/env.config';
import { HttpService } from '@nestjs/axios';
import { TicketStatus } from 'src/shared/constants/ticket-status.constant';

@Injectable()
export class PaymentsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private configService: ConfigService<EnvConfig, true>,
        private readonly httpService: HttpService,
    ) { }

    async payForTicket(userId: string, ticketId: string, paymentDto: PaymentDto) {
        const ticket = await this.databaseService.ticket.findUnique({
            where: {
                ticketId
            }
        });

        if (!ticket || ticket.ticketUserId !== userId) throw new BadRequestException("Bad Request");

        const port = this.configService.get('PAYMENT_API_PORT');
        const paymentApiUrl = `http://localhost:${port}/payment`;
        const accessToken = this.configService.get("PAYMENT_API_ACCESS_TOKEN");

        const paymentData = {
            last4: paymentDto.last4Digits,
            expiration: paymentDto.cardExpiry,
            cardholder: paymentDto.cardHolderName,
            paymentToken: paymentDto.paymentToken,
            amount: paymentDto.paymentAmount
        }

        try {
            const res = await this.httpService.axiosRef.post(paymentApiUrl, paymentData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })

            await this.databaseService.ticket.update({
                where: {
                    ticketId,
                },
                data: {
                    ticketStatus: TicketStatus.PAID,
                    ticketTransactionId: res.data.transactionId
                }
            })

            return res.data;

        } catch (error) {
            throw new BadRequestException("Payment failed ", error)
        }
    }


    async cancelTicket(userId: string, ticketId: string) {
        const ticket = await this.databaseService.ticket.findUnique({
            where: {
                ticketId
            }
        });

        if (!ticket || ticket.ticketUserId !== userId) throw new BadRequestException("Bad Request");

        const canceledTicket = await this.databaseService.ticket.update({
            where: {
                ticketId
            },
            data: {
                ticketStatus: TicketStatus.CANCELLED
            }
        });

        return canceledTicket
    }
}
