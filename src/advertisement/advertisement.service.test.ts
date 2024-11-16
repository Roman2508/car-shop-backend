import { Test, TestingModule } from '@nestjs/testing';
import { Between, ILike, MoreThan, Repository } from 'typeorm';
import { AdvertisementService } from './advertisement.service';
import { AdvertisementEntity } from './entities/advertisement.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AdvertisementService', () => {
  let service: AdvertisementService;
  let repository: Repository<AdvertisementEntity>;

  const mockRepository = {
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdvertisementService,
        {
          provide: getRepositoryToken(AdvertisementEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AdvertisementService>(AdvertisementService);
    repository = module.get<Repository<AdvertisementEntity>>(getRepositoryToken(AdvertisementEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('filter by title with ILike', async () => {
    const query = { title: 'Audi' };
    mockRepository.findAndCount.mockResolvedValue([[], 0]);

    await service.paginateAndFilter(query);

    expect(mockRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          title: ILike('%Audi%'),
        }),
      }),
    );
  });

  it('filter by price range', async () => {
    const query = { priceFrom: 10000, priceTo: 20000 };
    mockRepository.findAndCount.mockResolvedValue([[], 0]);

    await service.paginateAndFilter(query);

    expect(mockRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          price: Between(10000, 20000),
        }),
      }),
    );
  });

  it('filter by mileage and sort by cheapest first', async () => {
    const query = { mileageFrom: 50000, first: 'cheap' };
    mockRepository.findAndCount.mockResolvedValue([[], 0]);

    await service.paginateAndFilter(query);

    expect(mockRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          mileage: MoreThan(50000),
        }),
        order: {
          price: 'ASC',
        },
      }),
    );
  });

  it('filter by year of release range', async () => {
    const query = { yearOfReleaseStart: 2010, yearOfReleaseEnd: 2015 };
    mockRepository.findAndCount.mockResolvedValue([[], 0]);

    await service.paginateAndFilter(query);

    expect(mockRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          yearOfRelease: Between(2010, 2015),
        }),
      }),
    );
  });

  it('filter by multiple array fields (technicalCondition, comfort)', async () => {
    const query = { technicalCondition: 'Good', comfort: 'Air Conditioning' };
    mockRepository.findAndCount.mockResolvedValue([[], 0]);

    await service.paginateAndFilter(query);

    expect(mockRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          technicalCondition: expect.anything(),
          comfort: expect.anything(),
        }),
      }),
    );
  });

  it('should apply default sorting by createdAt in DESC order', async () => {
    const query = {};
    mockRepository.findAndCount.mockResolvedValue([[], 0]);

    await service.paginateAndFilter(query);

    expect(mockRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        order: {
          createdAt: 'DESC',
        },
      }),
    );
  });
});
