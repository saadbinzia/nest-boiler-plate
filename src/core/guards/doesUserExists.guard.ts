import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/app/user/user.service';


@Injectable()
export class DoesUserExist implements CanActivate {
	constructor(private readonly _userService: UserService) { }

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		return this.validateRequest(request);
	}

	async validateRequest(request) {
		const userExist = await this._userService.findByEmail(request.body.email);
		if (userExist) {
			throw new ForbiddenException('This email already exist');
		}
		return true;
	}
}
