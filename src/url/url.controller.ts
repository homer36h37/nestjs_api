import { Body, Controller, Get, Param, Post, Res, Delete } from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenURLDto } from './dto/url.dto';

@Controller()
export class UrlController {
  constructor(private service: UrlService) {}

  // Создание короткой ссылки:
  @Post('shorten')
  shortenUrl(
    @Body()
    url: ShortenURLDto,
  ) {
    return this.service.shortenUrl(url);
  }
  // Переадресация:
  @Get('url/one/:code')
  // @Get(':code')
  async redirect(
    @Res() res,
    @Param('code')
    code: string,
  ) {
    const url = await this.service.redirect(code);

    return res.redirect(url.longUrl);
  }

  // Получение информации о всех сслыках:
  @Get('url/all')
  findAll() {
    return this.service.findAll();
  }

  // Получение информации о ссылке:
  @Get('url/one/info/:id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.service.findOne(
        id,
      );
      return {
        success: true,
        data,
        message: 'User Fetched Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }



  // Удаление короткой ссылки:
  @Delete('url/one/delete/:code')
  async remove(@Param('urlCode') code: string) {
    return this.service.remove(code);
  }
  
  
  
  
}