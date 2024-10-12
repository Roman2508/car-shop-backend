import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { Between, LessThan, MoreThan, Not, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdvertisementEntity } from './entities/advertisement.entity';

export interface IAdvertisementQuery {
  limit: string;
  offset: string;
  priceFrom: string | undefined;
  priceTo: string | undefined;

  title: string | undefined;
  category: string | undefined;
  subcategory: string | undefined;
  carType: string | undefined;
  mileage: string | undefined;
  сustomsСleared: string | undefined;
  engineVolume: string | undefined;
  theCarWasDrivenFrom: string | undefined;
  yearOfRelease: string | undefined;
  carBodyType: string | undefined;
  seatsCount: string | undefined;
  color: string | undefined;
  gearbox: string | undefined;
  driveType: string | undefined;
  fuelType: string | undefined;
  varnishCoating: string | undefined;

  technicalCondition: string | undefined;
  comfort: string | undefined;
  multimedia: string | undefined;
  security: string | undefined;
}


//  {
//     "title": "Продаж авто Tesla model Y",
//     "description": "Продаж авто Tesla model Y, пригнана з США",
//     "price": 1771781,
//     "category": "Легкові автомобілі",
//     "subcategory": "Tesla",
//     "carType": "З пробігом",
//     "mileage": 1300,
//     "сustomsСleared": "Так",
//     "engineVolume": 3,
//     "theCarWasDrivenFrom": "США",
//     "yearOfRelease": 2021,
//     "carBodyType": "Седан",
//     "seatsCount": 4,
//     "color": "Білий",
//     "gearbox": "Автомат",
//     "driveType": "Повний",
//     "fuelType": "Електро",
//     "varnishCoating": "Як нове, без видимих слідів експлуатації",
//     "technicalCondition": ["На ходу, технічно справна", "Не бита", "Не пофарбована"],
//     "comfort": ["Електропакет", "Електросклопідйомники", "Шкіряний салон"],
//     "multimedia": ["AUX"],
//     "security": ["Броньований автомобіль"],
//     "photos": ["https://hvylya.net/images/2024/09/04/kbZ2HqVKTBTQx0jZwdUFG0jnpCMdX4C4yKRvDm6g.jpeg", "https://24tv.ua/resources/photos/news/202112/1812341.jpg?v=1661258202000", "https://res.cloudinary.com/unix-center/image/upload/c_limit,dpr_3.0,f_auto,fl_progressive,g_center,h_240,q_auto:good,w_385/supetg7hjl8wo0nr3xtq.jpg"],
//     "user": 1
//   }


@Injectable()
export class AdvertisementService {
  constructor(
    @InjectRepository(AdvertisementEntity)
    private repository: Repository<AdvertisementEntity>,
  ) {}

  paginateAndFilter(query: any) {
    const { limit, offset, priceFrom, priceTo, technicalCondition, comfort, multimedia, security, ...filterParams } =
      query;

    const filter = {} as any;

    if (priceFrom && priceTo) {
      filter.price = Between(+priceFrom, +priceTo);
    }

    if (priceFrom && !priceTo) {
      filter.price = MoreThan(+priceFrom);
    }

    if (!priceFrom && priceTo) {
      filter.price = LessThan(+priceTo);
    }

    if (technicalCondition) {
      filter.technicalCondition = Raw((alias) => `${technicalCondition} = ANY(${alias})`);
    }

    if (comfort) {
      filter.comfort = Raw((alias) => `${comfort} = ANY(${alias})`);
    }

    if (multimedia) {
      filter.multimedia = Raw((alias) => `${multimedia} = ANY(${alias})`);
    }

    if (security) {
      filter.security = Raw((alias) => `${security} = ANY(${alias})`);
    }

    return this.repository.findAndCount({
      where: { ...filterParams, ...filter },
      take: limit,
      skip: offset,
      // order: { id: 'ASC' },
    });
  }

  searchByString(id: number) {
    return `This action returns a #${id} advertisement`;
  }

  getNew() {
    return this.repository.findAndCount({
      where: { status: 'АКТИВНЕ' },
      order: { createdAt: 'ASC' },
    });
  }

  async getBestsellers(id: number) {
    const allRecords = await this.repository.find({ select: ['id'] });

    if (allRecords.length === 0) {
      return [];
    }

    // const shuffledRecords = this.shuffleArray(allRecords);

    for (let i = allRecords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allRecords[i], allRecords[j]] = [allRecords[j], allRecords[i]];
    }
    const shuffledRecords = allRecords;

    const randomIds = shuffledRecords.slice(0, 10).map((record) => record.id);

    return this.repository.findByIds(randomIds);
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: { user: true, photos: true } });
  }

  create(dto: CreateAdvertisementDto) {
    const photos = dto.photos ? dto.photos.map((el) => ({ id: Number(el) })) : [];

    const ad = this.repository.create({
      ...dto,
      photos,
      user: { id: dto.user },
    });
    return this.repository.save(ad);
  }

  async update(id: number, dto: UpdateAdvertisementDto) {
    const ad = await this.repository.findOne({ where: { id } });

    const { user: _, ...rest } = dto;
    const photos = dto.photos ? dto.photos.map((el) => ({ id: Number(el) })) : [];
    return this.repository.save({ ...ad, ...rest, photos });
  }

  async accept(id: number) {
    const ad = await this.repository.findOne({ where: { id, status: 'ОЧІКУЄ ПІДТВЕРДЖЕННЯ' } });
    return this.repository.save({ ...ad, status: 'АКТИВНЕ' });
  }

  async remove(id: number) {
    const res = await this.repository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException('Групу не знайдено');
    }

    return id;
  }
}
