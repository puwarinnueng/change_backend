import { SearchTaskDto } from './dto/search-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request, UseInterceptors, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guards';
import { TasksInterceptor } from './interceptors/task.interceptor';

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) { }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TasksInterceptor)
    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @Request() { user }: any
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto , user)
    }

    //ทุกครั้งที่ทำไรใน controller จะส่งหา service เสมอ
    @UseGuards(JwtAuthGuard)
    @Get()
    getTasks(
        @Request() { user }: any,
        @Query() searchTaskDto: SearchTaskDto,
    ): Promise<Task[]> {
        return this.taskService.getTasks(user , searchTaskDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getTaskById(
        @Param('id') id: string,
        @Request() { user }: any

    ): Promise<Task> {
        return this.taskService.getTaskById(id,user)
    }


    // @Patch(':id/update')
    @UseGuards(JwtAuthGuard)
    @Patch('update/:id')
    updateTask(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @Request() { user }: any
    ): Promise<Task> {
        return this.taskService.updateTask(id, updateTaskDto,user)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    deleteTask(
        @Param('id') id: string,
        @Request() { user }: any
    ): Promise<Task> {
        return this.taskService.deleteTask(id,user)
    }

}