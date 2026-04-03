import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP Status Code' })
  statusCode: number;

  @ApiProperty({
    example: 'Error message or array of validation errors',
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
    ],
    description: 'The detail of the error',
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request', description: 'HTTP Status Error Type' })
  error: string;
}
