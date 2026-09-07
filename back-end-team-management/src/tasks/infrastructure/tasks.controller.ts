import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from '../application/tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { ListTasksDto } from './dto/list-tasks.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

const idParam = new ParseUUIDPipe({
  exceptionFactory: () => new BadRequestException('O identificador deve ser um UUID válido'),
});

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() query: ListTasksDto) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', idParam) id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', idParam) id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', idParam) id: string) {
    return this.tasksService.remove(id);
  }
}
