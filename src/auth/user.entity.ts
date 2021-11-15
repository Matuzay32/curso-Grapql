import { Task } from "src/tasks/entities/task-entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
@PrimaryGeneratedColumn() 
id:string


@Column({unique:true})
username:string

@Column()
password:string

@OneToMany((_type) => Task, task => task.user,{eager:true})
tasks:Task[]
}
