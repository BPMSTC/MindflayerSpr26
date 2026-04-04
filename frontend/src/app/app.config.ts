import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
// <<<<<<< Updated upstream

import { routes } from './app.routes';
//=======
//import { provideHttpClient, withInterceptors } from '@angular/common/http';

//import { routes } from './app.routes';
//import { jwtInterceptor } from './@core/interceptors/jwt.interceptor';
//import { errorInterceptor } from './@core/interceptors/error.interceptor';
// >>>>>>> Stashed changes

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
//<<<<<<< Updated upstream
//    provideRouter(routes)
//=======
    provideRouter(routes)
//    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor]))
// >>>>>>> Stashed changes
  ]
};
