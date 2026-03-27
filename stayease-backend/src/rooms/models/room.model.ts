import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Hotel } from '../../hotels/hotel.model';
import { RoomImage } from './room-image.model';

export enum RoomType {
  SINGLE = 'single',
  DOUBLE = 'double',
  SUITE = 'suite',
}

@Table({
  tableName: 'rooms',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Room extends Model<Room> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Hotel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare hotel_id: string;

  @BelongsTo(() => Hotel)
  declare hotel: Hotel;

  @Column({ type: DataType.STRING, allowNull: false })
  declare room_number: string;

  @Column({ type: DataType.ENUM(...Object.values(RoomType)), allowNull: false })
  declare room_type: RoomType;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare capacity: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price_per_night: number;

  @Column({ type: DataType.JSON, allowNull: true })
  declare amenities: string[]; // Stores ["wifi", "ac", "tv"]

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: boolean;

  @HasMany(() => RoomImage, { onDelete: 'CASCADE', hooks: true })
  declare images: RoomImage[];
}
