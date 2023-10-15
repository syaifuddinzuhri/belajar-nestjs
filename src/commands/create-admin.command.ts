import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { SeederService } from 'src/services/seeder.service';

@Injectable()
export class CreateAdminCommand {
  constructor(private readonly seederService: SeederService) {}

  @Command({
    command: 'create-admin',
    describe: 'Run the seeder [npx nestjs-command create-admin]',
  })
  async run() {
    try {
      await this.seederService.createAdminData();
      console.log('Admin created successfully');
    } catch (error) {
      console.log('Error: ' + error.message);
    }
  }
}
