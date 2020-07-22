import {Orm} from '../services/orm.service';
import {User} from '../../../entity/user/user';
import {RestContext} from '../../rest/helpers/context';

export interface Context extends RestContext<User, Orm> {

}
