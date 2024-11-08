import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, Equal, ILike, In, LessThan, MoreThan, Not, Or, Raw, Repository } from 'typeorm';

import { AdvertisementEntity } from './entities/advertisement.entity';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';

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
  model: string;
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

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectRepository(AdvertisementEntity)
    private repository: Repository<AdvertisementEntity>,
  ) {}

  paginateAndFilter(query: any) {
    const {
      first,
      limit,
      offset,
      priceFrom,
      yearOfReleaseStart,
      yearOfReleaseEnd,
      mileageFrom,
      mileageTo,
      priceTo,
      technicalCondition,
      comfort,
      multimedia,
      security,
      ...filterParams
    } = query;

    const filter = {} as any;
    const order = {} as any;

    if (query.title) {
      filter.title = ILike(`%${query.title}%`);
    }

    if (first) {
      if (first === 'cheap') {
        order.price = 'ASC';
      } else if (first === 'expensive') {
        order.price = 'DESC';
      } else if (first === 'old') {
        order.createdAt = 'ASC';
      } else {
        order.createdAt = 'DESC';
      }
    } else {
      order.createdAt = 'DESC';
    }

    /* price */
    if (priceFrom && priceTo) {
      filter.price = Between(+priceFrom, +priceTo);
    }

    if (priceFrom && !priceTo) {
      filter.price = MoreThan(+priceFrom);
    }

    if (!priceFrom && priceTo) {
      filter.price = LessThan(+priceTo);
    }

    /* mileage */
    if (mileageFrom && mileageTo) {
      filter.mileage = Between(+mileageFrom, +mileageTo);
    }

    if (mileageFrom && !mileageTo) {
      filter.mileage = MoreThan(+mileageFrom);
    }

    if (!mileageFrom && mileageTo) {
      filter.mileage = LessThan(+mileageTo);
    }

    /* yearOfRelease */
    if (yearOfReleaseStart && yearOfReleaseEnd) {
      filter.yearOfRelease = Between(+yearOfReleaseStart, +yearOfReleaseEnd);
    }

    if (yearOfReleaseStart && !yearOfReleaseEnd) {
      filter.yearOfRelease = MoreThan(+yearOfReleaseStart);
    }

    if (!yearOfReleaseStart && yearOfReleaseEnd) {
      filter.yearOfRelease = LessThan(+yearOfReleaseEnd);
    }

    /*  */
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

    if (Object.keys(filterParams).length) {
      for (const key in filterParams) {
        const values = filterParams[key].split(';');

        if (key === 'engineVolume') {
          filter[key] = Raw((alias) => {
            const numbers = values.map((v) => Number(v.split(' ')[0]));
            return numbers.map((v) => `${alias} IN (${v})`).join(' OR ');
          });
        } else {
          filter[key] = Raw((alias) => values.map((v) => `${alias} LIKE '%${v}%'`).join(' OR '));
        }
      }
    }

    return this.repository.findAndCount({
      where: { ...filterParams, ...filter, status: 'АКТИВНЕ' },
      relations: { photos: true },
      take: limit ? limit : 20,
      skip: offset ? offset : 0,
      order,
    });
  }

  searchByString(title: string) {
    return this.repository.findAndCount({
      where: { title: ILike(`%${title}%`) },
      relations: { photos: true },
      take: 20,
    });
  }

  getNew() {
    return this.repository.findAndCount({
      where: { status: 'АКТИВНЕ' },
      relations: { photos: true },
      order: { createdAt: 'ASC' },
      take: 20,
    });
  }

  async getBestsellers() {
    const allRecords = await this.repository.find({ select: ['id'] });

    if (allRecords.length === 0) {
      return [];
    }

    for (let i = allRecords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allRecords[i], allRecords[j]] = [allRecords[j], allRecords[i]];
    }
    const shuffledRecords = allRecords;

    const randomIds = shuffledRecords.slice(0, 10).map((record) => record.id);

    return this.repository.findAndCount({
      where: { id: In(randomIds), status: 'АКТИВНЕ' },
      relations: { photos: true },
      take: 20,
    });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: { user: true, photos: true } });
  }

  getMy(id: number) {
    return this.repository.find({ where: { user: { id } }, relations: { user: true, photos: true } });
  }

  getNotAccepted() {
    return this.repository.find({
      where: { status: Or(Equal('ОЧІКУЄ ПІДТВЕРДЖЕННЯ'), Equal('НЕАКТИВНЕ')) },
      relations: { user: true, photos: true },
    });
  }

  create(dto: CreateAdvertisementDto) {
    const photos = dto.photos ? [...new Set(dto.photos)].map((el) => ({ id: Number(el) })) : [];

    const newAdvertisement = {} as CreateAdvertisementDto;

    for (const key in dto) {
      const typeNumberValues = ['price', 'mileage', 'engineVolume', 'yearOfRelease'];

      if (typeNumberValues.some((el) => el === key)) {
        newAdvertisement[key] = Number(dto[key]);
      } else {
        newAdvertisement[key] = dto[key];
      }
    }

    const ad = this.repository.create({
      ...newAdvertisement,
      status: 'ОЧІКУЄ ПІДТВЕРДЖЕННЯ',
      user: { id: dto.user },
      photos,
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
    const ad = await this.repository.findOne({ where: { id } });

    if (!ad) throw new NotFoundException('Оголошення не знайдено!');
    if (ad.status === 'ОЧІКУЄ ПІДТВЕРДЖЕННЯ') {
      return this.repository.save({ ...ad, status: 'АКТИВНЕ' });
    }

    if (ad.status === 'АКТИВНЕ') {
      return this.repository.save({ ...ad, status: 'НЕАКТИВНЕ' });
    }

    if (ad.status === 'НЕАКТИВНЕ') {
      return this.repository.save({ ...ad, status: 'АКТИВНЕ' });
    }

    throw new NotFoundException('An unexpected error occurred');
  }

  async remove(id: number) {
    const res = await this.repository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException('Групу не знайдено');
    }

    return id;
  }
}
