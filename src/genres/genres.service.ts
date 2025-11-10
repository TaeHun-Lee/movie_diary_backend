import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genresRepository: Repository<Genre>,
  ) {}

  create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const genre = this.genresRepository.create(createGenreDto);
    return this.genresRepository.save(genre);
  }

  findAll(): Promise<Genre[]> {
    return this.genresRepository.find();
  }

  async findOne(id: number): Promise<Genre> {
    const genre = await this.genresRepository.findOne({ where: { id } });
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.findOne(id);
    this.genresRepository.merge(genre, updateGenreDto);
    return this.genresRepository.save(genre);
  }

  async remove(id: number): Promise<void> {
    const genre = await this.findOne(id);
    await this.genresRepository.remove(genre);
  }

  async findOrCreateGenres(genreNames: string[]): Promise<Genre[]> {
    if (!genreNames || genreNames.length === 0) {
      return [];
    }

    const existingGenres = await this.genresRepository.findBy({
      name: In(genreNames),
    });

    const existingGenreNames = existingGenres.map((g) => g.name);
    const newGenreNames = genreNames.filter(
      (name) => !existingGenreNames.includes(name),
    );

    const newGenres: Genre[] = [];
    if (newGenreNames.length > 0) {
      for (const name of newGenreNames) {
        const newGenre = this.genresRepository.create({ name });
        newGenres.push(await this.genresRepository.save(newGenre));
      }
    }

    return [...existingGenres, ...newGenres];
  }
}
