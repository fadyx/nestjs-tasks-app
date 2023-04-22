import { Column, Entity, ManyToOne, Index, JoinColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../utils/entities/base.entity';

@Entity()
@Index(['userId', 'id', 'isComplete'])
export class Task extends BaseEntity {
  @Column()
  public title: string;

  @Column({ nullable: true, type: 'text' })
  public description: string | null;

  @Index('task_user_id_index')
  @ManyToOne(() => User, (user: User) => user.tasks, { nullable: false })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column({ nullable: false })
  public userId: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isComplete: boolean;
}

export default Task;
