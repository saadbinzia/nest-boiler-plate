import { ArgumentMetadata, BadRequestException, UnprocessableEntityException, ValidationPipe } from "@nestjs/common";

export class ValidateInputPipe extends ValidationPipe {
	public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
		try {
			return await super.transform(value, metadata)
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw new UnprocessableEntityException(this.handleError(error['response'].message))
			}
		}
	}

	private handleError(errors) {
		return errors.map(error => error);
	}
}