import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Document Management API')
    .setDescription('API documentation for Document Management System')
    .setVersion('1.0')
    .addTag('documents')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearerAuth', // This name must match the Security Requirement name
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      // Built-in Request Interceptor: Automatically attaches the token to all requests
      requestInterceptor: (req: any) => {
        if (window['swagger_token']) {
          req.headers['Authorization'] = `Bearer ${window['swagger_token']}`;
        }
        return req;
      },
      // Built-in Response Interceptor: Captures the token from login/signin responses
      responseInterceptor: (res: any) => {
        const isLoginEndpoint = res.url.includes('/auth/signin') || res.url.includes('/auth/login');
        if (isLoginEndpoint && res.ok && res.body) {
          try {
            const data = typeof res.body === 'string' ? JSON.parse(res.body) : res.body;
            // Support both direct response and wrapped response (data.access_token or access_token)
            const token = data?.data?.access_token || data?.access_token;
            if (token) {
              window['swagger_token'] = token;
              console.log('Swagger: Token captured and stored in memory.');
            }
          } catch (e) {
            console.error('Swagger: Failed to parse login response', e);
          }
        }
        return res;
      },
    },
  });
}