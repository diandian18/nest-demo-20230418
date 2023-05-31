import { Global, Logger, Module, OnModuleInit } from '@nestjs/common';
import { HttpModule as AxiosHttpModule, HttpService as AxiosHttpService } from '@nestjs/axios';
import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {ConfigService} from '@/config/config.service';
// import {WinstonLogger} from 'nest-winston';

type ResType = any;

@Global()
@Module({
  imports: [
    AxiosHttpModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          timeout: +configService.get('HTTP_TIMEOUT'),
          maxRedirects: +configService.get('HTTP_MAX_REDIRECTS'),
        };
      },
    }),
  ],
  //providers: [AxiosHttpModule],
})
export class HttpModule extends AxiosHttpModule implements OnModuleInit {
  private logger = new Logger(HttpModule.name);
  constructor(
    private readonly httpService: AxiosHttpService,
  ) {
    super();
  }

  onModuleInit() {
    const axios = this.httpService.axiosRef;

    axios.interceptors.request.use(
      // @ts-ignore
      (config: AxiosRequestConfig) => {
        this.logger.log(`[Axios request interceptor] config: ${config.method.toUpperCase()} ${config.url}`);
        return config; 
      },
      (error) => {
        this.logger.error(`[Axios request interceptor] error: ${error}`);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response: AxiosResponse<ResType>) => {
        this.logger.log(`[Axios response interceptor success] response: ${response.data}`);
        return response;
      },
      (error: AxiosError<ResType>) => {
        this.logger.error(`[Axios response interceptor fail] error: ${error}`); 
        return Promise.reject(error);
      }
    );
  }
}

