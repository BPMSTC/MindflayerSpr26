import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const currentUser = localStorage.getItem('currentUser');

  if (currentUser) {
    const user = JSON.parse(currentUser);
    if (user?.token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      });
    }
  }

  return next(req);
};
