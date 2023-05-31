import {isEnvLocal} from '@/common/utils/env';
import * as path from 'path';
import {createLogger, format, transports} from 'winston';
import { utilities as nestWinstonModuleUtilities} from 'nest-winston';
import {getNoSplit2DigitDay} from '@/common/utils/date';

const transportsList = [];
if (!isEnvLocal) {
  transportsList.push(...[
    new transports.File({
      dirname: getTodayFileName(),
      filename: `info.log`,
      level: 'info',
    }),
    new transports.File({
      dirname: getTodayFileName(),
      filename: 'error.log',
      level: 'error',
    }),
  ]);
}

const winstonInstance = createLogger({
  // level: 'info',
  format: nestLikeFormat(true),
  // defaultMeta: { service: 'user-service' },
  transports: transportsList,
});

if (isEnvLocal) {
  winstonInstance.add(new transports.Console({
    format: nestLikeFormat(false),
  }));
}

function getTodayFileName() {
  return path.join(__dirname, `../../logs/${getNoSplit2DigitDay()}/`);
}

function nestLikeFormat(fileMode: boolean) {
  return format.combine(
    // format.colorize(),
    format.timestamp({
      // format: 'YYYY/MM/DD HH:mm:ss',
    }),
    format.ms(),
    // format.label({ label: 'winston' }),
    // format.printf(({ level, message, label, timestamp }) => {
    //   return `${level} ${timestamp} [${label}]: ${message}`;
    // }),
    nestWinstonModuleUtilities.format.nestLike('Winston', {
      colors: !fileMode,
      prettyPrint: true,
    }),
  );
}
  
export {winstonInstance};

