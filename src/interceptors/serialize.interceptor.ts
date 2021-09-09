import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain, plainToClass } from 'class-transformer';

export function Serialize(dto: any, schema: any): any {
  return UseInterceptors(new SerializeInterceptor(dto, schema));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any, private schema: any) {}
  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    request.body = plainToClass(this.dto, request.body);
    request.body = classToPlain(request.body, {
      excludeExtraneousValues: true,
    });

    return handler.handle().pipe(
      map((data: any) => {
        console.log('Running after the handler', data);
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
