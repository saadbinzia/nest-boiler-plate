import { IsNotEmpty } from 'class-validator';


export class ImageDTO {

  @IsNotEmpty({ message: `Path should not be empty!` })
  readonly path: string;
}
