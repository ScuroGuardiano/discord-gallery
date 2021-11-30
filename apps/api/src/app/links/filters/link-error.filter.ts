import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from 'express';
import LinkExpiredError from "../errors/link-expired";
import LinkNotFoundError from "../errors/link-not-found";

@Catch(LinkExpiredError, LinkNotFoundError)
export default class LinkErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 400;

    if (exception instanceof LinkNotFoundError) {
      status = 404;
    }

    return response
    .status(status)
    .json({
      statusCode: status,
      errorType: exception.name,
      message: exception.message
    });
  }
}
