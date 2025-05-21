import { IsNotEmpty } from "class-validator";

export class CronDTO {
  @IsNotEmpty({ message: `Key should not be empty!` })
  readonly key: string;
}
