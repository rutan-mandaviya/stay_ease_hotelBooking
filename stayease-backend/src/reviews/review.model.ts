import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Hotel } from '../hotels/hotel.model';
import { Booking } from '../bookings/booking.model';

@Table({ tableName: 'reviews', timestamps: true })
export class Review extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  })
  declare rating: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare comment: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare user_id: string;

  @ForeignKey(() => Hotel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare hotel_id: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare booking_id: string;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Hotel)
  declare hotel: Hotel;
}
