import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { IUser } from '../Interfaces/user.interface';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(body: IUser): Promise<User> {
    const user = this.repo.create(body);
    const res = await this.repo.save(user);
    return res;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne({ id: id });
    return user;
  }

  async find(email: string): Promise<User[]> {
    const users = await this.repo.find({ email });
    return users;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    return this.repo.remove(user);
  }
}
