import { IsNotEmpty } from 'class-validator';


export class CronDTO {

  @IsNotEmpty({ message: `Email should not be empty!` })
  readonly key: string;
}
