import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from 'express';
import JobAlreadyEnqueuedError from "../errors/job-already-enqueued";
import JobAlreadyRunningError from "../errors/job-already-running";
import RescanOnCooldownError from "../errors/rescan-on-cooldown";

@Catch(
  JobAlreadyEnqueuedError,
  JobAlreadyRunningError,
  RescanOnCooldownError
)
export default class IndexSchedulerErrorsFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Currently all errors occurs when user want to start job that is already running
    // Or want rescan too soon. I count it as violation of rate limiting.
    const status = HttpStatus.TOO_MANY_REQUESTS;

    return response
    .status(status)
    .json({
      statusCode: status,
      errorType: error.name,
      message: error.message
    });
  }
}
