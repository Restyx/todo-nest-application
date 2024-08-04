import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseRpcExceptionFilter, RmqContext } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch(HttpException)
export class ServiceExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    if (host.getType() !== 'rpc') super.catch(exception, host);

    const response: any = exception.getResponse();

    if (response.statusCode === 400) {
      const context: RmqContext = host.getArgByIndex(1);
      const channel = context.getChannelRef();
      const message = context.getMessage();
      channel.ack(message);
    }

    console.log('Error: ', response);

    return throwError(() => {
      return response;
    });
  }
}
