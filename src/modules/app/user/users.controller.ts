import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";

@ApiTags("Clients / Simple User")
@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly userService: UserService) {}
}
