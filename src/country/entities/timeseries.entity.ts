import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from './country.entity';

@Entity()
export class TimeSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  Name: string;

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

  @Column({
    nullable: true,
  })
  CountryID: number;

  @ManyToOne(() => Country, (country) => country.timeseries)
  @JoinColumn({
    name: 'CountryID',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_CountryID',
  })
  country: Country;
}
