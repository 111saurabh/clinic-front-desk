import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(username: string, password: string): Promise<User> {
    if (!username || !password) {
      throw new Error('Username or password is missing');
    }

    console.log('Registering user:', username); // 👈 log input

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ username, password: hashed });
    return this.userRepo.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }
}
