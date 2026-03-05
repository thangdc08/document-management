import { format, transports } from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';
import { WinstonModuleOptions } from 'nest-winston';

export const loggerConfig: WinstonModuleOptions = {
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp(),
                format.ms(),
                format.colorize(),
                format.printf(({ timestamp, level, message, context, ms }) => {
                    return `[${timestamp}] ${level} [${context || 'Application'}] ${message} ${ms}`;
                }),
            ),
        }),
        new WinstonDailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
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
