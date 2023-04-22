import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Task } from '../../tasks/entities/task.entity';
import { BaseEntity } from '../../utils/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToMany(() => Task, (task: Task) => task.user)
  public tasks?: Task[];

  @Column({ nullable: true, type: 'text' })
  @Exclude()
  public currentHashedRefreshToken: string | null;
}

export default User;
