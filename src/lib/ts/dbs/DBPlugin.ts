import { T_Database, T_Persistence } from '../common/Enumerations';
import { k } from '../common/Global_Imports';
import DBCommon from './DBCommon';

export default class DBPlugin extends DBCommon {
	kind_persistence = T_Persistence.none;
	t_database = T_Database.plugin;
	idBase = k.empty;
}

export const dbPlugin = new DBPlugin();