import router from "@adonisjs/core/services/router";
import { HttpContext } from "@adonisjs/core/http";
import BaseMessage from "../app/utils/base_message.js";
import User from "#models/user";

router.get('users', async ({ request, response }: HttpContext) => {
  const page = request.input('page', 1)

  try {
    const user = await User.query().paginate(page, Number(10))

    return response.status(200).send(BaseMessage(true, "Users fetched successfully", user))
  } catch (error) {
    return response.status(error.status || 500).send(BaseMessage(false, error.message))
  }
})
