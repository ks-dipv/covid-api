import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExcelService } from './services/excel.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetExcelDto } from './dtos/excel.dto';

@Controller('api/country/timeseries/excel')
@ApiTags('Data in excel file')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}
  @Get()
  @ApiOperation({
    summary: 'an endpoint to download the data in Excel ',
  })
  @ApiResponse({
    status: 200,
    description:
      'return a Excel file with total confirmed, total deadths, total recovered for each country for each month',
  })
  @ApiQuery({
    name: 'isoCodes',
    type: 'string',
    required: false,
    description:
      'return countries data in excel based on iso code given in query',
    example: 'IN',
  })
  @ApiQuery({
    name: 'year',
    type: 'number',
    required: false,
    description: 'return countries data in excel based on year given in query',
    example: 2021,
  })
  async downloadCovidData(@Query() query: GetExcelDto, @Res() res: Response) {
    try {
      const { isoCodes, year } = query;
      const workbook = await this.excelService.generateExcel(isoCodes, year);

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=covid-data.xlsx',
      );

      await workbook.xlsx.write(res);
      res.send();
    } catch (error) {
      console.log('error by excel', error);
      res.status(500).send('internal server error');
    }
  }
}
