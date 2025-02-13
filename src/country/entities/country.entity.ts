import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeSeries } from './timeseries.entity';

@Entity()
// @Unique(['code'])
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  Name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  flag: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  code: string;

  @OneToMany(() => TimeSeries, (time) => time.country)
  timeseries: TimeSeries[];
}
