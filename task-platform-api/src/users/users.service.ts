import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'user' = 'user',
  ) {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.repo.save(
      this.repo.create({ name, email, passwordHash, role }),
    );
  }

  list() {
    return this.repo.find();
  }
}
