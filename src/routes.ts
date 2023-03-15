import { Routes } from 'nest-router';
import { AdminEndModule } from './modules/admin/adminEnd.module';
import { AppEndModule } from './modules/app/appEnd.module';

export const routes: Routes = [
  {
    path: '',
    module: AppEndModule,
  },
  {
    path: '/admin',
    module: AdminEndModule,
  },
];
