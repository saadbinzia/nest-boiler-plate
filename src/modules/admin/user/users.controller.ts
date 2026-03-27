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
  UnprocessableResponse,
} from "src/core/config/interface/swaggerResponse.dto";
import { Roles } from "src/core/decorators/role-decorator";
import { RolesGuard } from "src/core/guards/checkRole.guard";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/core/guards/permissions.guard";
import { RequirePermission } from "src/core/decorators/permissions.decorator";
import { Permission } from "src/core/config/rbac";
import { AdminUpdateUserDTO, UserDTO } from "./dto";
import { UserService } from "./user.service";
import { GetUsersQueryDTO } from "./dto/getUserQuerry.dto";

const { USER_ROLES, RESPONSE_STATUSES } = GlobalEnums;
@ApiTags("Admin Users")
@Controller("admin/users")
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth("access-token")
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
  @RequirePermission(Permission.USERS_CREATE)
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
          fullName: "Mohsin Shoaib",
          password: "P@ss2word",
        },
      },
      b: {
        summary: "Sample that return validation error",
        value: {
          email: "mohsinshoaib055",
          fullName: "Mohsin Shoaib",
          password: "pass2word",
        },
      },
    },
  })
  async createUser(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: UserDTO,
  ): Promise<void> {
    try {
      // Use role from request body, default to USER if not provided
      const role = body.role || USER_ROLES.USER;
      const response = await this._userService.createUser(req, body, role);
      res.status(response.statusCode).json(response);
    } catch (error) {
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  /**
   * Find
   * @description Find user by id.
   * @param {Response} res
   * @param {AuthenticatedRequest} req
   * @returns {Promise<JSON>}
   */
  @Get("find-user-by-id/:userId")
  @RequirePermission(Permission.USERS_VIEW)
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
  ): Promise<void> {
    try {
      const response = await this._userService.find(req, +userId);
      res.status(response.statusCode).json(response);
    } catch (error) {
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  /**
   * Get All staff (pagination + search)
   * @description Get all users.
   * @param {Response} res
   * @param {AuthenticatedRequest} req
   * @returns {Promise<JSON>}
   */
  @Post("get-all-staff")
  @RequirePermission(Permission.USERS_MANAGE_STAFF)
  @ApiOperation({
    summary: "Get all users (paginated + search)",
    description: "Get all users if token is valid.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "Users found",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  @ApiBearerAuth("access-token")
  async getAllStaff(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Body() Body: GetUsersQueryDTO,
  ): Promise<void> {
    try {
      const response = await this._userService.getAllStaff(req, Body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );
      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  /**
   * Get All users (pagination + search)
   * @description Get all users.
   * @param {Response} res
   * @param {AuthenticatedRequest} req
   * @returns {Promise<JSON>}
   */
  @Post("get-all-users")
  @RequirePermission(Permission.USERS_MANAGE_TENANTS)
  @ApiOperation({
    summary: "Get all users (paginated + search)",
    description: "Get all users if token is valid.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "Users found",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  @ApiBearerAuth("access-token")
  async getAllUsers(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Body() Body: GetUsersQueryDTO,
  ): Promise<void> {
    try {
      const response = await this._userService.getAllUsers(req, Body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );
      res.status(errorResponse.statusCode).json(errorResponse);
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
  @Put("update-user-by-id/:userId")
  @RequirePermission(Permission.USERS_EDIT)
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
  @ApiBody({
    description: "Fields allowed to update",
    type: AdminUpdateUserDTO,
    examples: {
      valid: {
        summary: "Valid update payload",
        value: {
          fullName: "Test Dev",
        },
      },
      invalidName: {
        summary: "Invalid name (contains digits)",
        value: {
          fullName: "T3st Dev1",
        },
      },
    },
  })
  @ApiBearerAuth("access-token")
  async updateUser(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @Body() payload: AdminUpdateUserDTO,
    @Param() { userId }: { userId: string },
  ): Promise<void> {
    try {
      const response = await this._userService.updateUser(
        req,
        +userId,
        payload,
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  @UseInterceptors(FileInterceptor("file"))
  @Put("upload-profile-image-by-id/:userId")
  @Get("find-user-by-id/:userId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN)
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
  ): Promise<void> {
    try {
      res.json(await this._userService.uploadImage(req, file, +userId));
    } catch (error) {
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  @Delete("delete-profile-image-by-id/:userId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN)
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
  ): Promise<void> {
    try {
      res.json(await this._userService.deleteImage(req, +userId));
    } catch (error) {
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  @Delete("delete-user-by-id/:userId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  @ApiBearerAuth("access-token")
  @ApiParam({
    name: "userId",
    type: String,
    description: "The user id",
    required: true,
  })
  @ApiOperation({
    summary: "Delete user",
    description: "Delete user if token is valid.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Token is missing or invalid",
    type: unAuthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "User deleted successfully",
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Some kind of error",
    type: ErrorResponse,
  })
  async deleteUser(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param() { userId }: { userId: string },
  ): Promise<void> {
    try {
      res.json(await this._userService.deleteUser(req, +userId));
    } catch (error) {
      const errorResponse = this._globalResponses.formatResponse(
        req,
        RESPONSE_STATUSES.ERROR,
        error,
        "default",
      );

      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }
}
