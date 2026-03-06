import { format, transports } from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';
import { WinstonModuleOptions } from 'nest-winston';
import * as fs from 'fs';
import * as path from 'path';
export const loggerConfig: WinstonModuleOptions = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  transports: [
    new transports.Console({
      handleExceptions: true,
      format: format.combine(
        format.timestamp(),
        format.ms(),
        format.colorize(),
        format.printf(({ timestamp, level, message, context, ms }) => {
          return `[${timestamp}] ${level} [${context || 'App'}] ${message} ${ms}`;
        }),
      ),
    }),

    new WinstonDailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(format.timestamp(), format.json()),
    }),

    new WinstonDailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
};