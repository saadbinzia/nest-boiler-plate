import { Controller } from "@nestjs/common";
import GlobalResponses from "src/core/config/GlobalResponses";
import { UserVerificationCodeService } from "./userVerificationCode.service";

/**
 * User Verification Codes Controller
 */
@Controller("user-verification-code")
export class UserVerificationCodesController {
  constructor(
    private readonly _service: UserVerificationCodeService,
    private readonly _globalResponses: GlobalResponses,
  ) {}
}
