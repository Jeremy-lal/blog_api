import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    role: 'admin' | 'user';

    @Column({
        nullable: true
    })
    hashedRt: string;

    @CreateDateColumn()
    created_at: Date;
}