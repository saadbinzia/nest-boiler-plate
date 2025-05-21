import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { GlobalEnums } from "src/core/config/globalEnums";
import GlobalResponses from "src/core/config/GlobalResponses";
import { AuthenticatedRequest } from "src/core/config/interface/request.interface";
import {
  ErrorResponse,
  SuccessResponse,
  unAuthorizedResponse,
  UnprocessableResponse
} from "src/core/config/interface/swaggerResponse.dto";
import { Roles } from "src/core/decorators/role-decorator";
import { RolesGuard } from "src/core/guards/checkRole.guard";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { UpdateUserDTO, UserDTO } from "./dto";
import { UserService } from "./user.service";

@ApiTags("Admin Users")
@Controller("admin/users")
export class UsersController {
  constructor(
    private readonly _userService: UserService,
    private readonly _globalResponses: GlobalResponses,
  ) {}

  /**
   * Create user
   * @description Create new user record.
   * @param {Response} res
   * @param {UserDTO} body
   * @returns {Promise<JSON>}
   */
  @Post("create-user")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalEnums.USER_ROLES.SUPER_ADMIN)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "User Sign Up",
    description: "User can sign up from app end.",
  })
  @ApiResponse({
    status: 200,
    description: "Create Users Account",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 422,
    description: "Unprocessable Entity",
    type: UnprocessableResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  @ApiBody({
    description: "Create User Account",
    type: UserDTO,
    examples: {
      a: {
        summary: "Sample that return success response",
        value: {
          email: "someuniqueemail",
          firstName: "Saad",
          lastName: "Bin Zia",
          phoneNumber: "+923034197551",
          password: "P@ss2word",
          keepUserUpdated: true,
          agreeTermsAndConditions: true,
        },
      },
      b: {
        summary: "Sample that return validation error",
        value: {
          email: "saadbinzia055",
          firstName: "Saad",
          lastName: "Bin Zia",
          phoneNumber: "+923034197551",
          password: "pass2word",
          keepUserUpdated: true,
          agreeTermsAndConditions: true,
        },
      },
      c: {
        summary: "Sample with referral user and preferred language",
        value: {
          email: "saadbinzia055@gmail.com",
          firstName: "Saad",
          lastName: "Bin Zia",
          phoneNumber: "+923034197551",
          password: "P@ss2word",
          keepUserUpdated: true,
          agreeTermsAndConditions: true,
          referralUser: "username",
          preferredLanguage: "en",
        },
      },
    },
  })
  async createUser(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: UserDTO,
  ): Promise<object> {
    try {
      const response = await this._userService.createUser(
        req,
        body,
        GlobalEnums.USER_ROLES.USER,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        null,
      );
      return res.status(response.statusCode).json(response);
    }
  }

  /**
   * Find
   * @description Find user by id.
   * @param {Response} res
   * @param {AuthenticatedRequest} req
   * @returns {Promise<JSON>}
   */
  @UseGuards(JwtAuthGuard)
  @Get("find-user-by-id/:userId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalEnums.USER_ROLES.SUPER_ADMIN)
  @ApiBearerAuth("access-token")
  @ApiParam({
    name: "userId",
    type: String,
    description: "The user id",
    required: true,
  })
  @ApiOperation({
    summary: "Find user",
    description: "Find user by id if token is valid.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  @ApiBearerAuth("access-token")
  async find(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Param() { userId }: { userId: string },
  ): Promise<object> {
    try {
      const response = await this._userService.find(req, +userId);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        null,
      );

      return res.status(response.statusCode).json(response);
    }
  }

  /**
   * Update user
   * @description Update user record on given condition.
   * @param {Response} res
   * @param {UpdateUserDTO} payload
   * @param {Object} param
   * @returns {Promise<JSON>}
   */
  @UseGuards(JwtAuthGuard)
  @Put("update-user-by-id/:userId")
  @Get("find-user-by-id/:userId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalEnums.USER_ROLES.SUPER_ADMIN)
  @ApiBearerAuth("access-token")
  @ApiParam({
    name: "userId",
    type: String,
    description: "The user id",
    required: true,
  })
  @ApiOperation({
    summary: "Update user",
    description: "Update user if token is valid.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 422,
    description: "Unprocessable Entity",
    type: UnprocessableResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  @ApiBearerAuth("access-token")
  async updateUser(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Body() payload: UpdateUserDTO,
    @Param() { userId }: { userId: string },
  ): Promise<object> {
    try {
      const response = await this._userService.updateUser(
        req,
        +userId,
        payload,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      const response = this._globalResponses.formatResponse(
        req,
        GlobalEnums.RESPONSE_STATUSES.ERROR,
        null,
        null,
      );

      return res.status(response.statusCode).json(response);
    }
  }

  @UseInterceptors(FileInterceptor("file"))
  @Put("upload-profile-image-by-id/:userId")
  @Get("find-user-by-id/:userId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalEnums.USER_ROLES.SUPER_ADMIN)
  @ApiBearerAuth("access-token")
  @ApiParam({
    name: "userId",
    type: String,
    description: "The user id",
    required: true,
  })
  @ApiOperation({
    summary: "Change profile image",
    description: "change profile image if token is valid.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "User's profile image changed successfully",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async uploadImage(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Param() { userId }: { userId: string },
  ): Promise<object> {
    try {
      return res.json(await this._userService.uploadImage(req, file, +userId));
    } catch (error) {
      console.error(error);
      return res.json(
        this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          null,
        ),
      );
    }
  }

  @Delete("delete-profile-image-by-id/:userId")
  @Get("find-user-by-id/:userId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(GlobalEnums.USER_ROLES.SUPER_ADMIN)
  @ApiBearerAuth("access-token")
  @ApiParam({
    name: "userId",
    type: String,
    description: "The user id",
    required: true,
  })
  @ApiOperation({
    summary: "Delete profile image",
    description: "Delete profile image if token is valid.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "User's profile image deleted successfully",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  async deleteImage(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param() { userId }: { userId: string },
  ): Promise<object> {
    try {
      return res.json(await this._userService.deleteImage(req, +userId));
    } catch (error) {
      console.error(error);
      return res.json(
        this._globalResponses.formatResponse(
          req,
          GlobalEnums.RESPONSE_STATUSES.ERROR,
          null,
          null,
        ),
      );
    }
  }
}
