import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Room } from './room.model';

@Table({
  tableName: 'room_images',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class RoomImage extends Model<RoomImage> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Room)
  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'CASCADE' })
  declare room_id: string;
  @BelongsTo(() => Room)
  room: Room;
  @Column({ type: DataType.STRING, allowNull: false })
  declare image_url: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare sort_order: number;
}
