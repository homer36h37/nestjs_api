import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Url {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @DeleteDateColumn()
    urlCode: string;

    @Column()
    longUrl: string;

    @Column()
    shortUrl: string;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ default: 0 })
    clickCount: number
}