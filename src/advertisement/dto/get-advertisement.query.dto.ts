import { ApiProperty } from '@nestjs/swagger';

export class GetAdvertisementQueryDto {
  @ApiProperty({ required: false })
  title: string | undefined;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false })
  price: number;

  @ApiProperty({ required: false })
  category: string;

  @ApiProperty({ required: false })
  subcategory: string;

  @ApiProperty({ required: false })
  model: string;

  @ApiProperty({ required: false })
  carType: string;

  @ApiProperty({ required: false })
  mileage: number;

  @ApiProperty({ required: false })
  сustomsСleared: string;

  @ApiProperty({ required: false })
  engineVolume: number;

  @ApiProperty({ required: false })
  theCarWasDrivenFrom: string;

  @ApiProperty({ required: false })
  yearOfRelease: number;

  @ApiProperty({ required: false })
  carBodyType: string;

  @ApiProperty({ required: false })
  seatsCount: number;

  @ApiProperty({ required: false })
  color: string;

  @ApiProperty({ required: false })
  gearbox: string;

  @ApiProperty({ required: false })
  driveType: string;

  @ApiProperty({ required: false })
  fuelType: string;

  @ApiProperty({ required: false })
  varnishCoating: string;

  @ApiProperty({ required: false })
  technicalCondition: string;

  @ApiProperty({ required: false })
  comfort: string;

  @ApiProperty({ required: false })
  multimedia: string;

  @ApiProperty({ required: false })
  security: string;
}
