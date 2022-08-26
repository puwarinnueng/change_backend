import { SearchTaskDto } from './dto/search-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { User } from 'src/user/user.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async createTask(createTaskDto: CreateTaskDto , user: User): Promise<Task> {
        const {
            title,
            description,
        } = createTaskDto

        const task = await this.taskRepository.create({
            title,
            description,
            user,
        })
        try {
            await this.taskRepository.save(task)
            return task
        } catch (e) {
            console.log("error")
            throw new ConflictException({
                message: ["something wrong"]
            })
        }
    }


    async getTasks(user: User , searchTaskDto: SearchTaskDto): Promise<Task[]> {
        try {
            // const tasks = await this.taskRepository.find({where: {user}})
            // return tasks

            const {
                search
            } = searchTaskDto
            const query = this.taskRepository.createQueryBuilder('task')
            query.where({ user })

            if(search){
                query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` })
            }

            const tasks = await query.getMany()

            return tasks
        } catch (e) {
            console.log("error")
            throw new NotFoundException({
                message: ["NotFoundException"]
            })
        }
    }


    async getTaskById(id: string , user: User): Promise<Task> {
        try {
            const taskid = await this.taskRepository.findOne({  where: {user,id}   })
            return taskid
        } catch (e) {
            throw new NotFoundException({
                message: ["something wrong"]
            })
        }
    }


    async updateTask(id: string, updateTaskDto: UpdateTaskDto ,user: User) {
        try {
            const task = await this.getTaskById(id , user)

            const {
                title,
                description,
            } = updateTaskDto

            if(title){
                task.title = title
            }

            if(description){
                task.description = description
            }

            await this.taskRepository.save(task)
            return task


        } catch (e) {
            throw new NotFoundException({
                message: ['task not found']
            })
        }
    }


    async deleteTask(id:string , user: User){
        try{
            const task = await this.getTaskById(id, user)
            await this.taskRepository.delete(id)

            return task
        }catch(e){
            throw new NotFoundException({
                message: ['ไม่พบข้อมูลที่จะลบ']
            })
        } 
    }
}
