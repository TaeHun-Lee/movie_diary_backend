import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const env = process.env.NODE_ENV || 'development';
const logDir = 'logs'; // 로그 저장 경로

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: `${logDir}/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30, // 30일치 저장
    zippedArchive: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(
        (info) => `${info.timestamp} [${info.level}] ${info.message}`,
      ),
    ),
  };
};

export const winstonConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: env === 'production' ? 'info' : 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('MovieDiary', {
          prettyPrint: true,
          colors: true,
        }),
      ),
    }),
    // 에러 로그 파일 저장
    new winstonDaily(dailyOptions('error')),
    // 모든 로그 파일 저장
    new winstonDaily(dailyOptions('info')),
  ],
});
