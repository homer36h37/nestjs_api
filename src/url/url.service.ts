import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
    HttpException,
  } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './url.entity';
import { ShortenURLDto } from './dto/url.dto';
import { nanoid } from 'nanoid';
import { isURL } from 'class-validator';
  
@Injectable()
export class UrlService {
constructor(
    @InjectRepository(Url)
    private repo: Repository<Url>,
) {}

async shortenUrl(url: ShortenURLDto) {
    const { longUrl } = url;

    //checks if longurl is a valid URL
    if (!isURL(longUrl)) {
    throw new BadRequestException('String Must be a Valid URL');
    }

    const urlCode = nanoid(10);
    // const urlCode = url.id;
    const baseURL = 'http://localhost:3000';

    try {
    //check if the URL has already been shortened
    let url = await this.repo.findOneBy({ longUrl });
    //return it if it exists
    if (url) return url.shortUrl;

    //if it doesn't exist, shorten it
    const shortUrl = `${baseURL}/${urlCode}`;

    //add the new record to the database
    url = this.repo.create({
        urlCode,
        longUrl,
        shortUrl,
    });

    this.repo.save(url);
    return url.shortUrl;
    } catch (error) {
    console.log(error);
    throw new UnprocessableEntityException('Server Error');
    }
}

// async redirect(urlCode: string) {
//     try {
//     const url = await this.repo.findOneBy({ urlCode });
//     if (url) return url;
//     } catch (error) {
//     console.log(error);
//     throw new NotFoundException('Resource Not Found');
//     }
// }

// async redirect(urlCode: string) {
//   try {
//     const url = await this.repo.findOneBy({ urlCode });
//     if (url) return url;
//   } catch (error) {
//     console.log(error);
//     throw new NotFoundException('Resource Not Found');
//   }
// }



async redirect(urlCode: string) {
  const url = await this.repo.findOneBy({ urlCode });

  if (url) {
    return url;
  } else {
    throw new HttpException(
      'Url Not Found',
      404,
    );
  }
}




async findAll(): Promise<Url[]> {
    return await this.repo.find();
  }

// async create(
//     shortenURLDto: ShortenURLDto,
//   ): Promise<Url> {
//     const userData =
//       await this.repo.create(
//         shortenURLDto,
//       );
//     return this.repo.save(userData);
//   }

//   async findAll(): Promise<Url[]> {
//     return await this.repo.find();
//   }

// async findOne(urlCode: string) {
//     try {
//     const url = await this.repo.findOneBy({ urlCode });
//     if (url) return url;
//     } catch (error) {
//     console.log(error);
//     throw new NotFoundException('Resource Not Found');
//     }
// }
async findOne(id: string): Promise<Url> {
    const urlData =
      await this.repo.findOneBy({ id });
    if (!urlData) {
      throw new HttpException(
        'Url Not Found',
        404,
      );
    }
    return urlData;
  }

  // Удаление короткой ссылки по id:
  // async remove(id: string): Promise<Url> {
  //   const existingUrl = await this.findOne(id);
  //   return await this.repo.remove(
  //     existingUrl,
  //   );
  // }

  // Удаление короткой ссылки:
  async remove(code: string): Promise<string> {
    const data = await this.repo.findOneBy({ urlCode: code });
    if (!data) {
      return 'Url not found';
    }
    await this.repo.softDelete({ urlCode: code });
    return 'Url deleted succesfully';
  }

  // async remove(urlCode: string) {
  //   const url = await this.repo.findOneBy({ urlCode });
  
  //   if (url) {
  //     return await this.repo.remove(
  //       url,
  //     );
  //   } else {
  //     return await 'Error!!!'
  //   }
  // }

  // deleteTask(id: number): void {
  //   this.tasks = this.tasks.filter((task) => task.id !== id);
  // }

  
  



}