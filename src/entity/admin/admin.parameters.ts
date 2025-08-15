import { AdminSettings } from './admin.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';

@ObjectParametersType()
export class AdminSettingsParameters extends AdminSettings {
}
