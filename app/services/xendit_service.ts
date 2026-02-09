import env from '#start/env';
import { Invoice as InvoiceClient } from 'xendit-node';
import { CreateInvoiceRequest } from 'xendit-node/invoice/models/CreateInvoiceRequest.js';

export class XenditService {
    // private static xenditClient = new Xendit({
    //     secretKey: env.get('XENDIT_SECRET_KEY'),
    // })

    // xendit invoice instance
    private static xenditInvoiceClient = new InvoiceClient({
        secretKey: env.get('XENDIT_SECRET_KEY'),
    })

    // method to create invoice
    static async createInvoice(payload: CreateInvoiceRequest) {
        // create invoice
        const invoice = await this.xenditInvoiceClient.createInvoice({
            data: payload
        });

        return invoice
    }
}