import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Room } from '../rooms/models/room.model';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Table({
  tableName: 'bookings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Booking extends Model<Booking> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare user_id: string;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => Room)
  @Column({ type: DataType.UUID, allowNull: false })
  declare room_id: string;

  @BelongsTo(() => Room)
  declare room: Room;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare check_in_date: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare check_out_date: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare total_price: number;

  @Column({
    type: DataType.ENUM(...Object.values(BookingStatus)),
    defaultValue: BookingStatus.PENDING,
  })
  declare status: BookingStatus;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_paid: boolean;
}
