// src/hotels/hotel.model.ts
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Review } from 'src/reviews/review.model';
import { Room } from 'src/rooms/models/room.model';

@Table({ tableName: 'hotels', timestamps: true, underscored: true })
export class Hotel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare owner_id: string;

  @BelongsTo(() => User)
  declare owner: User;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare city: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare address: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare cover_image: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: boolean;

  @HasMany(() => Room)
  declare rooms: Room[];

  @HasMany(() => Review)
  declare reviews: Review[];
}
