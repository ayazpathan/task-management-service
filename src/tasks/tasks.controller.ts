import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-do';
import { GetTasksFilterDto } from './dto/get-tasks-flter.dto';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';
import { TaskStatusValidationPipe } from './pipes/task-status-validation-pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    
    if (Object.keys(filterDto).length){
      return this.tasksService.getTasksWithFilters(filterDto);
    }
    else {
      return this.tasksService.getAllTasks();      
    }
  }

  @Get('/:id')
  getTasksById(@Param('id') id: string): Task {
    return this.tasksService.getTasksById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string, 
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
   ) : Task {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
