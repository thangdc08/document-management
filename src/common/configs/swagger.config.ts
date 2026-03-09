import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: any) {
    // Cấu hình Swagger
    const config = new DocumentBuilder()
        .setTitle('Document Management API')
        .setDescription('API documentation for Document Management System')
        .setVersion('1.0')
        .addTag('documents')
        .addBearerAuth() // Nếu có dùng JWT
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
}