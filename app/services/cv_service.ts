import { DOMMatrix } from 'canvas'
import HttpException from '#exceptions/http_exception'
import { Infer } from '@vinejs/vine/types'
import { CvAnalyzeSchema, CvPaymentSchema } from '#validators/cv_validator'
import User from '#models/user'
import nodemationApiConfig from '../api/nodemation_api.js'
import AiCvAnalyzer from '#models/ai_cv_analyzer'
import { CvAnalysisResponse } from '../interfaces/cv_analysis_response_interface.js'
import AiPricing from '#models/ai_pricing'
import Promo from '#models/promo'
import { MidtransService } from './midtrans_service.js'
import { DateTime } from 'luxon'
import CvHelper from '../utils/cv_helper.js'
import CreatePayment from '#events/create_payment'
(global as any).DOMMatrix = DOMMatrix

export class CvService extends CvHelper {
  /**
   * Method to analyze CV File
   */
  async analyzeCvFile(payload: Infer<typeof CvAnalyzeSchema>, user: User) {
    try {
      const result = await this.summarize(payload)

      // send data to nodemation
      const data = {
        ...result,
        cv_lang: payload.cv_lang,
        language_style: payload.language_style
      }

      const n8nResponse = await nodemationApiConfig.post('/webhook-test/cv/analyze', data).then(res => res.data)

      const safeName = payload.cv_file.clientName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '')

      const generateCvName = `${safeName}-${Date.now()}.${payload.cv_file.extname}`


      // move cv to storage
      await payload.cv_file.moveToDisk(`/cv-analyzer/${generateCvName}`, 'fs')

      // save ai response to db
      const aiCvAnalyzer = await user.related('aiCvAnalyzers').create({
        requestPayload: payload,
        cvRawText: result.raw_text,
        cvParsedJson: result.parsed_json,
        cvMarkdown: result.markdown_version,
        cvPath: `/cv-analyzer/${generateCvName}`,
        aiResponse: Array.isArray(n8nResponse) ? n8nResponse[0] : n8nResponse,
        aiModel: Array.isArray(n8nResponse) ? n8nResponse[0].result.ai_model : n8nResponse.result.ai_model,
      })

      // ai parsing
      const aiResponse = aiCvAnalyzer.aiResponse as CvAnalysisResponse;

      return {
        cvPath: aiCvAnalyzer.cvPath,
        selected_language: payload.cv_lang,
        language_style: payload.language_style,
        aiResponse: {
          overallImpression: {
            details: aiResponse.result.overallImpression.details,
            score: null,
            actionPoints: aiResponse.result.overallImpression.actionPoints,
            whyItsImportant: aiResponse.result.overallImpression.whyItsImportant
          },
          contactInformation: aiResponse.result.contactInformation,
          relevantSkill: aiResponse.result.relevantSkill,
        }
      }
    } catch (error: any) {
      throw new HttpException(error.message, error.status || 500)
    }
  }

  /**
   * Method to get CV Analysis history
   */
  async getCvAnalysisHistory(user: User): Promise<Array<{ id: number, cvPath: string }>> {
    try {
      const aiHistory = (await user.related('aiCvAnalyzers').query().select('id', 'cvPath').orderBy('created_at', 'desc')).map(record => {
        return {
          id: record.id,
          cvPath: record.cvPath
        }
      })

      return aiHistory;

    } catch (error: any) {
      throw new HttpException(error.message, error.status || 500)
    }
  }

  /**
   * Method to show CV History
   */
  async showCvHistory(user: User, historyId: number): Promise<AiCvAnalyzer | CvAnalysisResponse | {
    cvPath: string;
    aiResponse: {
      overallImpression: any;
      contactInformation: any;
    };
  }> {
    try {
      const aiCvAnalyzer = await user.related('aiCvAnalyzers').query().select('id', 'aiResponse', 'cvPath').where('id', historyId).firstOrFail();

      const payment = await aiCvAnalyzer.related('payment').query().first()

      // check if payment is paid
      if (payment && payment.status === 'paid') {
        return aiCvAnalyzer
      }

      // get ai response
      const aiResponse = aiCvAnalyzer.aiResponse as CvAnalysisResponse;

      return {
        cvPath: aiCvAnalyzer.cvPath,
        aiResponse: {
          overallImpression: {
            details: aiResponse.result.overallImpression.details,
            score: null,
            actionPoints: aiResponse.result.overallImpression.actionPoints,
            whyItsImportant: aiResponse.result.overallImpression.whyItsImportant
          },
          contactInformation: aiResponse.result.contactInformation,
          relevantSkill: aiResponse.result.relevantSkill,
        },
      }

    } catch (error: any) {
      throw new HttpException(error.message, error.status || 500)
    }
  }

  /**
   * Method to handle payment for AI CV Reviewers
   */
  async payForCvAnalysis(user: User, historyId: number, payload: Infer<typeof CvPaymentSchema>) {
    try {

      // declare variable
      let finalPrice: number = 0;
      let totalAmount: number = 0;
      let promoId: number | null = null;

      const aiCvAnalyzer = await user.related('aiCvAnalyzers').query().where('id', historyId).firstOrFail();
      const aiPayment = await aiCvAnalyzer.related('payment').query().first();

      // check if cv is already paid
      if (aiPayment && aiPayment.status === 'paid') throw new HttpException('CV Analysis already paid', 400)

      // calculate the price
      const aiPrice = await AiPricing.query().first();
      if (!aiPrice) throw new HttpException('AI Pricing not found', 500)

      finalPrice = aiPrice.price
      totalAmount = aiPrice.price

      // check if the ai price have discount
      if (aiPrice.discount && aiPrice.discountType) {
        finalPrice = this.calculateAiDiscount(finalPrice, aiPrice.discount, aiPrice.discountType)
      }

      // check if the user used promo code
      if (payload.promo_code) {
        const promo = await Promo.query().where('code', payload.promo_code).first();
        if (!promo) throw new HttpException('Invalid promo code', 400)

        promoId = promo.id;

        // calculate the final price with promo
        finalPrice = this.calculatePromo(finalPrice, promo);
      }

      // create midtrans payment gateway
      const orderId = MidtransService.createOrderId();
      const midtrans = await MidtransService.createTransaction(
        orderId,
        finalPrice,
        user
      )

      const cvPayment = await aiCvAnalyzer.related('payment').query().first();
      const paymentExpiredAt: DateTime = DateTime.now().plus({ days: 1 })

      // check if payment already exist
      if (cvPayment) {

        // check if cv has been paid
        if (cvPayment.status === 'paid') throw new HttpException('CV Analysis already paid', 400)

        await aiCvAnalyzer.related('payment').query().where('id', cvPayment.id).update({
          paymentMethod: payload.payment_method,
          totalAmount: totalAmount,
          promoId: promoId,
          orderId: orderId,
          totalPaid: finalPrice,
          status: 'pending',
          gatewayToken: midtrans.token,
          expiresAt: paymentExpiredAt.toFormat('yyyy-MM-dd HH:mm:ss')
        })
      } else {
        // save payment to database
        await aiCvAnalyzer.related('payment').create({
          paymentMethod: payload.payment_method,
          totalAmount: totalAmount,
          promoId: promoId,
          orderId: orderId,
          totalPaid: finalPrice,
          status: 'pending',
          gatewayToken: midtrans.token,
          expiresAt: paymentExpiredAt
        })
      }

      // send notification
      CreatePayment.dispatch({
        user: user,
        orderId: orderId,
        expiredTime: paymentExpiredAt.toFormat('yyyy-MM-dd HH:mm:ss'),
        paymentLink: midtrans.redirect_url,
        totalPaid: finalPrice
      })

      return {
        PaymentGateway: {
          ...midtrans,
          expired_at: paymentExpiredAt.toFormat('yyyy-MM-dd HH:mm:ss')
        },
        selected_payment: payload.payment_method
      }
    } catch (error: any) {
      throw new HttpException(error.message, error.status || 500)
    }
  }
}
