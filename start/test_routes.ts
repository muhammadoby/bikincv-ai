import router from "@adonisjs/core/services/router";
import { HttpContext } from "@adonisjs/core/http";
import BaseMessage from "../app/utils/base_message.js";
import AffBalance from "#models/aff_balance";

router.get('test', async ({ request, response }: HttpContext) => {
  const page = request.input('page', 1)

  try {
    const user = await AffBalance.query().paginate(page, Number(10))

    return response.status(200).send(BaseMessage(true, "Data fetched successfully", user))
  } catch (error) {
    return response.status(error.status || 500).send(BaseMessage(false, error.message))
  }
})
