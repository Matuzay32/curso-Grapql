import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaksStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task-entity';
import { Like, Repository } from 'typeorm';
import { Console } from 'console';
import { UserEntity } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Logger  } from '@nestjs/common';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksController');
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  
  async getTasks(filterDto: GetTaskFilterDto,@GetUser() user: UserEntity, ): Promise<Task[]> {
    const { search, status } = filterDto;
    // // const query = this.taskRepository.createQueryBuilder('task');
    // const task = this.taskRepository.find();

    // if (status) {
    //   return this.taskRepository.find({ where: { status: status } });
    // }
    // if (search) {
    //   return this.taskRepository.find({
    //     where: [{ title: search }, { description: search }],
    //   });
    // }
    // return task;

    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere("task.status = :status", { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title)LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {

    const tasks = await query.getMany();

    return tasks;

    } catch (error) {
      this.logger.error(`failed to get tasks for user : ${user.username} Filters : ${JSON.stringify( filterDto)}`,error.stack,);

      throw new InternalServerErrorException(" Failed to get all Tasks");
    }
    
  }


  async getTaskById(id: string, user: UserEntity): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No se encontro el elemento con el  ID : ${id}`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return found;
  }


  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<Task> {


    const { title, description } = createTaskDto;
    
    const newTask = this.taskRepository.create({
      description,
      title,
      status: TaksStatus.OPEN,
      user,
    });
    
    return this.taskRepository.save(newTask);

    // return this.taskRepository.save(coffee);
  }


  async deleteTaskById(id: string, @GetUser() user:UserEntity): Promise<void> {
    const taskDelete = await this.taskRepository.delete({id,user});
    if (taskDelete.affected === 0) {
      throw new NotFoundException(`Element with ID ${id} not found `);
    }
    console.log(taskDelete);
  }


  async updateTaskStatus( id: string,status: TaksStatus, user: UserEntity, ): Promise<Task> {

    const task = await this.getTaskById(id,user);
    task.status = status;

    await this.taskRepository.save(task);
    return task;
  }
}
