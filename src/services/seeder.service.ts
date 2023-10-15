import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { MongooseTransaction } from 'src/helpers/functions';
import { AdminDocument } from 'src/schemas';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel('admin') private readonly adminSchema: Model<AdminDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async createAdminData() {
    return MongooseTransaction(this.connection, async () => {
      await this.adminSchema.create({
        email: 'admin@gmail.com',
        username: 'admin',
        password: 'admincuan2023',
        name: 'Administrator',
      });
    });
  }
}
