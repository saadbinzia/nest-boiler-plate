import { WebAppModule } from './modules/app/webApp.module';

export const routes = [
  {
    path: '',
    module: WebAppModule,
  },

  // Will uncomment this code when we will integrate the admin module
  // {
  //   path: '/admin',
  //   module: AdminModule,
  // },
];
