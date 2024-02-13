import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import GlobalResponses from 'src/core/config/GlobalResponses';

@Module({
  controllers: [
    ImagesController,
  ],
  providers: [
    GlobalResponses
  ]
})
export class ImageModule { }
