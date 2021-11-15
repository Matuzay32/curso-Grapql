import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaksStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import { Task } from './entities/task-entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';

@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get('/:id')

async getTaskById(  @Param('id') id: string,@GetUser() user: UserEntity,): Promise<Task> {

    return await this.tasksService.getTaskById(id, user);
  }

  @Get()
  getTasks( @Query() filterDto: GetTaskFilterDto,@GetUser() user: UserEntity,): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} retreving all tasks. Filters: ${JSON.stringify(filterDto,)}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }


  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: UserEntity) {

    this.logger.verbose(
      `Task description${JSON.stringify(
        createTaskDto.description,
      )} Task Title: ${JSON.stringify(
        createTaskDto.title,
      )} Username: ${JSON.stringify(user.username)}`,
    );


    return this.tasksService.createTask(createTaskDto, user);
  }


  @Delete('/:id')
  deleteTaskById(@Param('id') id: string, user: UserEntity): void {
    this.tasksService.deleteTaskById(id, user);
  }


  
  @Patch('/:id/status') updateTaskStatus(@Param('id') id: string,@Body() updateTaskStatusDto: UpdateTaskStatusDto,@GetUser() user: UserEntity,): Promise<Task> {
   
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
