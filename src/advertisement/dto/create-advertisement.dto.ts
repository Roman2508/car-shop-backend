import { ApiProperty } from '@nestjs/swagger';

export class CreateAdvertisementDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  subcategory: string;

  @ApiProperty()
  carType: string;

  @ApiProperty()
  mileage: number;

  @ApiProperty()
  сustomsСleared?: string;

  @ApiProperty()
  engineVolume?: number;

  @ApiProperty()
  theCarWasDrivenFrom?: string;

  @ApiProperty()
  yearOfRelease: number;

  @ApiProperty()
  carBodyType: string;

  @ApiProperty()
  seatsCount?: number;

  @ApiProperty()
  color: string;

  @ApiProperty()
  gearbox: string;

  @ApiProperty()
  driveType: string;

  @ApiProperty()
  fuelType: string;

  @ApiProperty()
  varnishCoating: string;

  @ApiProperty({ default: [] })
  technicalCondition: string[];

  @ApiProperty({ default: [] })
  comfort?: string[];

  @ApiProperty({ default: [] })
  multimedia?: string[];

  @ApiProperty({ default: [] })
  security?: string[];

  @ApiProperty()
  photos: string[];

  @ApiProperty()
  user: number;
}
