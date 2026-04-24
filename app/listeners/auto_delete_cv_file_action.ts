import AiCvAnalyzer from "#models/ai_cv_analyzer";
import { DateTime } from "luxon";
import drive from "@adonisjs/drive/services/main";
import logger from "@adonisjs/core/services/logger";

export default class AutoDeleteCvFileAction {
  async handle() {
    const storage = drive.use("fs");

    const limitDate = DateTime.now().minus({ months: 2 }).toJSDate();

    const cvs = await AiCvAnalyzer.query()
      .preload("payment")
      .where("createdAt", "<", limitDate);

    for (const cv of cvs) {
      const payment = cv.payment;

      // check if cv doesnt have payment and cv is not paid
      if ((!payment || payment.status !== "paid") && cv.cvPath) {
        try {
          await storage.delete(cv.cvPath);

          cv.cvPath = '';
          await cv.save();

          logger.info("deleted:", cv.id);
        } catch (error: any) {
          logger.error("delete failed:", cv.id, error.message);
        }
      }
    }
  }
}
