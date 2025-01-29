import { User } from "Src/database/entities/User.entity";
import { Bcrypt } from "Src/Services/Bcrypt";
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>): Promise<any> | void {
    event.entity.password = Bcrypt.hash(event.entity.password);
  }

  beforeUpdate(event: UpdateEvent<User>): Promise<any> | void {
    if (event.updatedColumns.some((col) => col.propertyName === "password")) Bcrypt.hash(event.databaseEntity.password);
  }
}
