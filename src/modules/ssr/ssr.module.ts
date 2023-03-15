import { Module } from '@nestjs/common';
import { SSRController } from './ssr.controller';

@Module({
  imports: [
  ],
  controllers: [
    SSRController,
  ],
  providers: [
  ]
})
export class SSRModule { }
