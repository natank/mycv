import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export function Serialize(dto: any): any {
  return UseInterceptors(new SerializeInterceptor(dto));
}

async function validateRequest(dto, request) {
  let errors;
  try {
    request.body = plainToClass(dto, request.body);
    errors = await validate(request.body);
    console.log(errors);
  } catch (error) {
    console.log(error);
    throw error;
  }
  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }
}

function transformRequest(request) {
  request.body = classToPlain(request.body, {
    excludeExtraneousValues: true,
  });
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    /* Validate */
    await validateRequest(this.dto, request);
    /* transform */
    transformRequest(request);

    return handler.handle().pipe(
      map((data: any) => {
        console.log('Running after the handler', data);
        const res = classToPlain(data, {
          excludeExtraneousValues: true,
        });
        console.log(`res: ${JSON.stringify(res)}`);
        return res;
      }),
    );
  }
}
