import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task-do';
import { GetTasksFilterDto } from './dto/get-tasks-flter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search }= filterDto;
    let tasks = this.getAllTasks();

    if(status){
      tasks = tasks.filter(task => task.status === status);
    }

    if(search){
      tasks = tasks.filter(task => 
        task.title.includes(search) || 
        task.description.includes(search)
      );
    }
    return tasks;
  }

  getTasksById(id: string): Task {
    const found = this.tasks.find(task => task.id === id);
    if(!found) {
      throw new NotFoundException(`Task with ID : ${id} has not been found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;
    
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    const found = this.getTasksById(id);
    this.tasks = this.tasks.filter(task => task.id !== found.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTasksById(id);
    task.status = status;
    return task;
  }
}
