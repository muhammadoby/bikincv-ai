import AutoSwagger from "adonis-autoswagger";
import swagger from "#config/swagger";
import router from "@adonisjs/core/services/router";

router.get("/swagger", async () => {
  return AutoSwagger.default.json(router.toJSON(), swagger);
});

router.get("/docs", async () => {
  return AutoSwagger.default.ui("/swagger", swagger);
});
