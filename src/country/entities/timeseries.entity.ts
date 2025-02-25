import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from './country.entity';

@Entity()
export class TimeSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  date: string;

  @Column({
    type: 'int4',
  })
  confirmed: number;

  @Column({
    type: 'int4',
  })
  deaths: number;

  @Column({
    type: 'int4',
  })
  recovered: number;

  @ManyToOne(() => Country, (country) => country.timeseries)
  country: Country;
}
