import { Exclude } from "class-transformer";
import { UserEntity } from "src/auth/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TaksStatus } from "../tasks.model";

@Entity()
export class Task {


    @PrimaryGeneratedColumn() 
    id:string;


    @Column()
    title:string;

    @Column()
    description:string;

    @Column()
    status:TaksStatus;
    @ManyToOne((_type)=>UserEntity,user=>user.tasks,{eager:false},)
    
    @Exclude({toPlainOnly:true})
    user:UserEntity
}
