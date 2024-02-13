import { Module } from '@nestjs/common';
import { SSRController } from './ssr.controller';
import GlobalResponses from 'src/core/config/GlobalResponses';

@Module({
  imports: [
  ],
  controllers: [
    SSRController,
  ],
  providers: [
    GlobalResponses
  ]
})
export class SSRModule { }
